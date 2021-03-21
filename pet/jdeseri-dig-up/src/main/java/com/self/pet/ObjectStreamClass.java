package com.self.pet;

import java.io.*;
import java.util.*;
import java.util.concurrent.*;
import java.lang.ref.*;
import java.lang.reflect.*;
import java.security.*;

public class ObjectStreamClass implements Serializable {

    public static final ObjectStreamField[] NO_FIELDS = new ObjectStreamField[0];

    private String name;
    private volatile Long suid;
    private boolean isProxy;
    private boolean hasWriteObjectData;
    private boolean hasBlockExternalData;
    private boolean externalizable;
    private boolean isEnum;
    private boolean serializable;
    private ObjectStreamField[] fields;
    private int primDataSize;
    private int numObjFields;
    private Class<?> cl;
    private ClassNotFoundException resolveEx;
    private ObjectStreamClass superDesc;
    private ExceptionInfo deserializeEx;
    private volatile ClassDataSlot[] dataLayout;
    private FieldReflector fieldRefl;
    private Method readResolveMethod;

    void readNonProxy(Reader in) throws IOException {
        name = in.readUTF();
        System.out.println(" Dig in class: " + name);
        suid = Long.valueOf(in.readLong());
        isProxy = false;

        byte flags = in.readByte();
        hasWriteObjectData = ((flags & ObjectStreamConstants.SC_WRITE_METHOD) != 0);
        hasBlockExternalData = ((flags & ObjectStreamConstants.SC_BLOCK_DATA) != 0);
        externalizable = ((flags & ObjectStreamConstants.SC_EXTERNALIZABLE) != 0);
        boolean sflag = ((flags & ObjectStreamConstants.SC_SERIALIZABLE) != 0);
        if (externalizable && sflag) {
            throw new RuntimeException("[" + name + "] serializable and externalizable flags conflict");
        }
        serializable = externalizable || sflag;
        isEnum = ((flags & ObjectStreamConstants.SC_ENUM) != 0);
        if (isEnum && suid.longValue() != 0L) {
            throw new RuntimeException("[" + name + "] enum descriptor has non-zero serialVersionUID: " + suid);
        }

        int numFields = in.readShort();
        if (isEnum && numFields != 0) {
            throw new RuntimeException("[" + name + "] enum descriptor has non-zero field count: " + numFields);
        }
        fields = (numFields > 0) ? new ObjectStreamField[numFields] : NO_FIELDS;
        if (numFields == 0) {
            System.out.println("Found no field of: " + name);
        }
        for (int i = 0; i < numFields; i++) {
            char tcode = (char) in.readByte();
            String fname = in.readUTF();
            String signature = ((tcode == 'L') || (tcode == '[')) ?  in.readTypeString() : new String(new char[] { tcode });
            try {
                fields[i] = new ObjectStreamField(fname, signature, false);
            } catch (RuntimeException e) {
                throw e;
            }
        }
        computeFieldOffsets();
    }

    private void computeFieldOffsets() {
        primDataSize = 0;
        numObjFields = 0;
        int firstObjIndex = -1;

        for (int i = 0; i < fields.length; i++) {
            ObjectStreamField f = fields[i];
            switch (f.getTypeCode()) {
                case 'Z':
                case 'B':
                    f.setOffset(primDataSize++);
                    break;

                case 'C':
                case 'S':
                    f.setOffset(primDataSize);
                    primDataSize += 2;
                    break;

                case 'I':
                case 'F':
                    f.setOffset(primDataSize);
                    primDataSize += 4;
                    break;

                case 'J':
                case 'D':
                    f.setOffset(primDataSize);
                    primDataSize += 8;
                    break;

                case '[':
                case 'L':
                    f.setOffset(numObjFields++);
                    if (firstObjIndex == -1) {
                        firstObjIndex = i;
                    }
                    break;

                default:
                    throw new InternalError();
            }
        }
        if (firstObjIndex != -1 &&
            firstObjIndex + numObjFields != fields.length)
        {
            throw new RuntimeException("[" + name + "] illegal field order");
        }
    }

    void initNonProxy(ObjectStreamClass model,
                      Class<?> cl,
                      ClassNotFoundException resolveEx,
                      ObjectStreamClass superDesc)
        throws InvalidClassException
    {
        this.cl = cl;
        this.resolveEx = resolveEx;
        this.superDesc = superDesc;
        name = model.name;
        //suid = Long.valueOf(model.getSerialVersionUID());
        suid = model.suid == null ? 0 : model.suid.longValue();
        isProxy = false;
        isEnum = model.isEnum;
        serializable = model.serializable;
        externalizable = model.externalizable;
        hasBlockExternalData = model.hasBlockExternalData;
        hasWriteObjectData = model.hasWriteObjectData;
        fields = model.fields;
        primDataSize = model.primDataSize;
        numObjFields = model.numObjFields;
        //fieldRefl = getReflector(fields, localDesc);
        fieldRefl = getReflector(fields, this);
        // reassign to matched fields so as to reflect local unshared settings
        //fields = fieldRefl.getFields();
    }

    void checkDeserialize() throws InvalidClassException {
        if (deserializeEx != null) {
            throw deserializeEx.newInvalidClassException();
        }
    }

    ClassNotFoundException getResolveException() {
        return resolveEx;
    }

    boolean isExternalizable() {
        return externalizable;
    }

    ClassDataSlot[] getClassDataLayout() throws InvalidClassException {
        if (dataLayout == null) {
            dataLayout = getClassDataLayout0();
        }
        return dataLayout;
    }

    private ClassDataSlot[] getClassDataLayout0() throws InvalidClassException {
        ArrayList<ClassDataSlot> slots = new ArrayList<>();
        Class<?> start = cl, end = cl;

        // locate closest non-serializable superclass
        while (end != null && Serializable.class.isAssignableFrom(end)) {
            end = end.getSuperclass();
        }

        HashSet<String> oscNames = new HashSet<>(3);

        for (ObjectStreamClass d = this; d != null; d = d.superDesc) {
            if (oscNames.contains(d.name)) {
                throw new InvalidClassException("Circular reference.");
            } else {
                oscNames.add(d.name);
            }

            // search up inheritance hierarchy for class with matching name
            Class<?> match = null;
            /*
            String searchName = (d.cl != null) ? d.cl.getName() : d.name;
            Class<?> match = null;
            for (Class<?> c = start; c != end; c = c.getSuperclass()) {
                if (searchName.equals(c.getName())) {
                    match = c;
                    break;
                }
            }
            */

            // add "no data" slot for each unmatched class below match
            /*
            if (match != null) {
                for (Class<?> c = start; c != match; c = c.getSuperclass()) {
                    slots.add(new ClassDataSlot(
                        ObjectStreamClass.lookup(c, true), false));
                }
                start = match.getSuperclass();
            }
            */

            // record descriptor/class pairing
            slots.add(new ClassDataSlot(d.getVariantFor(match), true));
        }

        // add "no data" slot for any leftover unmatched classes
        /*
        for (Class<?> c = start; c != end; c = c.getSuperclass()) {
            slots.add(new ClassDataSlot(
                ObjectStreamClass.lookup(c, true), false));
        }
        */

        // order slots from superclass -> subclass
        Collections.reverse(slots);
        return slots.toArray(new ClassDataSlot[slots.size()]);
    }

    private ObjectStreamClass getVariantFor(Class<?> cl) throws InvalidClassException {
        return this;
        /*
        if (this.cl == cl) {
            return this;
        }
        ObjectStreamClass desc = new ObjectStreamClass();
        if (isProxy) {
            desc.initProxy(cl, null, superDesc);
        } else {
            desc.initNonProxy(this, cl, null, superDesc);
        }
        return desc;
        */
    }

    boolean hasReadObjectMethod() {
        //return (readObjectMethod != null);
        return false;
    }

    boolean hasWriteObjectData() {
        return hasWriteObjectData;
    }

    int getPrimDataSize() {
        return primDataSize;
    }

    boolean hasReadResolveMethod() {
        return (readResolveMethod != null);
    }

    void setPrimFieldValues(Object obj, byte[] buf) {
        fieldRefl.setPrimFieldValues(obj, buf);
    }

    public ObjectStreamField[] getFields() {
        return getFields(true);
    }

    ObjectStreamField[] getFields(boolean copy) {
        return copy ? fields.clone() : fields;
    }

    int getNumObjFields() {
        return numObjFields;
    }

    void setObjFieldValues(Object obj, Object[] vals) {
        fieldRefl.setObjFieldValues(obj, vals);
    }

    private static FieldReflector getReflector(ObjectStreamField[] fields, ObjectStreamClass localDesc)
        throws InvalidClassException
    {
        // class irrelevant if no fields
        //Class<?> cl = (localDesc != null && fields.length > 0) ?  localDesc.cl : null;
        Class<?> cl = null;
        processQueue(Caches.reflectorsQueue, Caches.reflectors);
        FieldReflectorKey key = new FieldReflectorKey(cl, fields, Caches.reflectorsQueue);
        Reference<?> ref = Caches.reflectors.get(key);
        Object entry = null;
        if (ref != null) {
            entry = ref.get();
        }
        EntryFuture future = null;
        if (entry == null) {
            EntryFuture newEntry = new EntryFuture();
            Reference<?> newRef = new SoftReference<>(newEntry);
            do {
                if (ref != null) {
                    Caches.reflectors.remove(key, ref);
                }
                ref = Caches.reflectors.putIfAbsent(key, newRef);
                if (ref != null) {
                    entry = ref.get();
                }
            } while (ref != null && entry == null);
            if (entry == null) {
                future = newEntry;
            }
        }

        if (entry instanceof FieldReflector) {  // check common case first
            return (FieldReflector) entry;
        } else if (entry instanceof EntryFuture) {
            entry = ((EntryFuture) entry).get();
        } else if (entry == null) {
            try {
                entry = new FieldReflector(matchFields(fields, localDesc));
            } catch (Throwable th) {
                entry = th;
            }
            future.set(entry);
            Caches.reflectors.put(key, new SoftReference<Object>(entry));
        }

        if (entry instanceof FieldReflector) {
            return (FieldReflector) entry;
        } else if (entry instanceof InvalidClassException) {
            throw (InvalidClassException) entry;
        } else if (entry instanceof RuntimeException) {
            throw (RuntimeException) entry;
        } else if (entry instanceof Error) {
            throw (Error) entry;
        } else {
            throw new InternalError("unexpected entry: " + entry);
        }
    }

    static void processQueue(ReferenceQueue<Class<?>> queue, ConcurrentMap<? extends WeakReference<Class<?>>, ?> map) {
        Reference<? extends Class<?>> ref;
        while((ref = queue.poll()) != null) {
            map.remove(ref);
        }
    }

    private static ObjectStreamField[] matchFields(ObjectStreamField[] fields, ObjectStreamClass localDesc)
        throws InvalidClassException
    {
        ObjectStreamField[] localFields = (localDesc != null) ?  localDesc.fields : NO_FIELDS;

        ObjectStreamField[] matches = new ObjectStreamField[fields.length];
        for (int i = 0; i < fields.length; i++) {
            ObjectStreamField f = fields[i], m = null;
            for (int j = 0; j < localFields.length; j++) {
                ObjectStreamField lf = localFields[j];
                if (f.getName().equals(lf.getName())) {
                    if ((f.isPrimitive() || lf.isPrimitive()) &&
                        f.getTypeCode() != lf.getTypeCode())
                    {
                        throw new InvalidClassException(localDesc.name,
                            "incompatible types for field " + f.getName());
                    }
                    if (lf.getField() != null) {
                        m = new ObjectStreamField(lf.getField(), lf.isUnshared(), false);
                    } else {
                        m = new ObjectStreamField(lf.getName(), lf.getSignature(), lf.isUnshared());
                    }
                }
            }
            if (m == null) {
                m = new ObjectStreamField(f.getName(), f.getSignature(), false);
            }
            m.setOffset(f.getOffset());
            matches[i] = m;
        }
        return matches;
    }

    Object invokeReadResolve(Object obj) throws IOException, UnsupportedOperationException {
        if (readResolveMethod != null) {
            try {
                return readResolveMethod.invoke(obj, (Object[]) null);
            } catch (InvocationTargetException ex) {
                Throwable th = ex.getTargetException();
                if (th instanceof ObjectStreamException) {
                    throw (ObjectStreamException) th;
                } else {
                    throwMiscException(th);
                    throw new InternalError(th);  // never reached
                }
            } catch (IllegalAccessException ex) {
                // should not occur, as access checks have been suppressed
                throw new InternalError(ex);
            }
        } else {
            throw new UnsupportedOperationException();
        }
    }

    private static void throwMiscException(Throwable th) throws IOException {
        if (th instanceof RuntimeException) {
            throw (RuntimeException) th;
        } else if (th instanceof Error) {
            throw (Error) th;
        } else {
            IOException ex = new IOException("unexpected exception type");
            ex.initCause(th);
            throw ex;
        }
    }

    private static class ExceptionInfo {
        private final String className;
        private final String message;

        ExceptionInfo(String cn, String msg) {
            className = cn;
            message = msg;
        }

        InvalidClassException newInvalidClassException() {
            return new InvalidClassException(className, message);
        }
    }

    static class ClassDataSlot {

        final ObjectStreamClass desc;
        final boolean hasData;

        ClassDataSlot(ObjectStreamClass desc, boolean hasData) {
            this.desc = desc;
            this.hasData = hasData;
        }
    }

    private static class FieldReflector {

        /** handle for performing unsafe operations */
        //private static final Unsafe unsafe = Unsafe.getUnsafe();
        private static final long INVALID_FIELD_OFFSET = -1;

        private final ObjectStreamField[] fields;
        private final int numPrimFields;
        private final long[] readKeys;
        private final long[] writeKeys;
        private final int[] offsets;
        private final char[] typeCodes;
        private final Class<?>[] types;

        FieldReflector(ObjectStreamField[] fields) {
            this.fields = fields;
            int nfields = fields.length;
            readKeys = new long[nfields];
            writeKeys = new long[nfields];
            offsets = new int[nfields];
            typeCodes = new char[nfields];
            ArrayList<Class<?>> typeList = new ArrayList<>();
            Set<Long> usedKeys = new HashSet<>();


            for (int i = 0; i < nfields; i++) {
                ObjectStreamField f = fields[i];
                Field rf = f.getField();
                //long key = (rf != null) ?  unsafe.objectFieldOffset(rf) : Unsafe.INVALID_FIELD_OFFSET;
                long key = f.getOffset();
                readKeys[i] = key;
                writeKeys[i] = usedKeys.add(key) ? key : INVALID_FIELD_OFFSET;
                offsets[i] = f.getOffset();
                typeCodes[i] = f.getTypeCode();
                if (!f.isPrimitive()) {
                    typeList.add((rf != null) ? rf.getType() : null);
                }
            }

            types = typeList.toArray(new Class<?>[typeList.size()]);
            numPrimFields = nfields - types.length;
        }


        void setPrimFieldValues(Object obj, byte[] buf) {
            if (obj == null) {
                throw new NullPointerException();
            }
            for (int i = 0; i < numPrimFields; i++) {
                long key = writeKeys[i];
                if (key == INVALID_FIELD_OFFSET) {
                    continue;           // discard value
                }
                int off = offsets[i];
                switch (typeCodes[i]) {
                    case 'Z':
                        //unsafe.putBoolean(obj, key, Bits.getBoolean(buf, off));
                        if (obj instanceof Map) {
                            ((Map) obj).put(""+key, Bits.getBoolean(buf, off));
                        } else {
                           throw new RuntimeException("IP");
                        }
                        break;

                    case 'B':
                        //unsafe.putByte(obj, key, buf[off]);
                        if (true) throw new RuntimeException("IP");
                        break;

                    case 'C':
                        //unsafe.putChar(obj, key, Bits.getChar(buf, off));
                        if (true) throw new RuntimeException("IP");
                        break;

                    case 'S':
                        //unsafe.putShort(obj, key, Bits.getShort(buf, off));
                        if (true) throw new RuntimeException("IP");
                        break;

                    case 'I':
                        //unsafe.putInt(obj, key, Bits.getInt(buf, off));
                        if (obj instanceof Map) {
                            ((Map) obj).put(""+key, Bits.getInt(buf, off));
                        } else {
                           throw new RuntimeException("IP");
                        }
                        break;

                    case 'F':
                        //unsafe.putFloat(obj, key, Bits.getFloat(buf, off));
                        if (obj instanceof Map) {
                            ((Map) obj).put(""+key, Bits.getFloat(buf, off));
                        } else {
                           throw new RuntimeException("IP");
                        }
                        break;

                    case 'J':
                        //unsafe.putLong(obj, key, Bits.getLong(buf, off));
                        if (obj instanceof Map) {
                            ((Map) obj).put(""+key, Bits.getLong(buf, off));
                        } else {
                           throw new RuntimeException("IP");
                        }
                        break;

                    case 'D':
                        //unsafe.putDouble(obj, key, Bits.getDouble(buf, off));
                        if (true) throw new RuntimeException("IP");
                        break;

                    default:
                        throw new InternalError();
                }
            }
        }

        void setObjFieldValues(Object obj, Object[] vals) {
            if (obj == null) {
                throw new NullPointerException();
            }
            for (int i = numPrimFields; i < fields.length; i++) {
                long key = writeKeys[i];
                if (key == INVALID_FIELD_OFFSET) {
                    continue;           // discard value
                }
                switch (typeCodes[i]) {
                    case 'L':
                    case '[':
                        Object val = vals[offsets[i]];
                        /*
                        if (val != null && !types[i - numPrimFields].isInstance(val)) {
                            Field f = fields[i].getField();
                            throw new ClassCastException(
                                "cannot assign instance of " +
                                val.getClass().getName() + " to field " +
                                f.getDeclaringClass().getName() + "." +
                                f.getName() + " of type " +
                                f.getType().getName() + " in instance of " +
                                obj.getClass().getName());
                        }
                        */
                        //unsafe.putObject(obj, key, val);
                        if (obj instanceof Map) {
                            ((Map)obj).put("_"+key, val);
                        } else {
                            throw new RuntimeException("PI");
                        }
                        break;

                    default:
                        throw new InternalError();
                }
            }
        }
    }

    private static class Caches {
        static final ConcurrentMap<WeakClassKey,Reference<?>> localDescs = new ConcurrentHashMap<>();
        static final ConcurrentMap<FieldReflectorKey,Reference<?>> reflectors = new ConcurrentHashMap<>();
        private static final ReferenceQueue<Class<?>> localDescsQueue = new ReferenceQueue<>();
        private static final ReferenceQueue<Class<?>> reflectorsQueue = new ReferenceQueue<>();
    }

    static class WeakClassKey extends WeakReference<Class<?>> {
        private final int hash;

        WeakClassKey(Class<?> cl, ReferenceQueue<Class<?>> refQueue) {
            super(cl, refQueue);
            hash = System.identityHashCode(cl);
        }

        public int hashCode() {
            return hash;
        }

        public boolean equals(Object obj) {
            if (obj == this) {
                return true;
            }

            if (obj instanceof WeakClassKey) {
                Object referent = get();
                return (referent != null) &&
                       (referent == ((WeakClassKey) obj).get());
            } else {
                return false;
            }
        }
    }

    private static class FieldReflectorKey extends WeakReference<Class<?>> {

        private final String sigs;
        private final int hash;
        private final boolean nullClass;

        FieldReflectorKey(Class<?> cl, ObjectStreamField[] fields, ReferenceQueue<Class<?>> queue) {
            super(cl, queue);
            nullClass = (cl == null);
            StringBuilder sbuf = new StringBuilder();
            for (int i = 0; i < fields.length; i++) {
                ObjectStreamField f = fields[i];
                sbuf.append(f.getName()).append(f.getSignature());
            }
            sigs = sbuf.toString();
            hash = System.identityHashCode(cl) + sigs.hashCode();
        }

        public int hashCode() {
            return hash;
        }

        public boolean equals(Object obj) {
            if (obj == this) {
                return true;
            }

            if (obj instanceof FieldReflectorKey) {
                FieldReflectorKey other = (FieldReflectorKey) obj;
                Class<?> referent;
                return (nullClass ? other.nullClass : ((referent = get()) != null)
                                  && (referent == other.get()))
                    && sigs.equals(other.sigs);
            } else {
                return false;
            }
        }
    }

    private static class EntryFuture {

        private static final Object unset = new Object();
        private final Thread owner = Thread.currentThread();
        private Object entry = unset;

        synchronized boolean set(Object entry) {
            if (this.entry != unset) {
                return false;
            }
            this.entry = entry;
            notifyAll();
            return true;
        }

        synchronized Object get() {
            boolean interrupted = false;
            while (entry == unset) {
                try {
                    wait();
                } catch (InterruptedException ex) {
                    interrupted = true;
                }
            }
            if (interrupted) {
                AccessController.doPrivileged(
                    new PrivilegedAction<Void>() {
                        public Void run() {
                            Thread.currentThread().interrupt();
                            return null;
                        }
                    }
                );
            }
            return entry;
        }

        Thread getOwner() {
            return owner;
        }
    }
}

