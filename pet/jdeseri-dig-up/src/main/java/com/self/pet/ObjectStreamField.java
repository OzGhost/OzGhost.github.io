package com.self.pet;

import java.lang.reflect.Field;

public class ObjectStreamField implements Comparable<Object> {

    private String name;
    private String signature;
    private boolean unshared;
    private final Field field;
    private final Class<?> type;
    private int offset = 0;

    ObjectStreamField(String name, String signature, boolean unshared) {
        if (name == null) {
            throw new NullPointerException();
        }
        this.name = name;
        this.signature = signature.intern();
        this.unshared = unshared;
        field = null;

        switch (signature.charAt(0)) {
            case 'Z': type = Boolean.TYPE; break;
            case 'B': type = Byte.TYPE; break;
            case 'C': type = Character.TYPE; break;
            case 'S': type = Short.TYPE; break;
            case 'I': type = Integer.TYPE; break;
            case 'J': type = Long.TYPE; break;
            case 'F': type = Float.TYPE; break;
            case 'D': type = Double.TYPE; break;
            case 'L':
            case '[': type = Object.class; break;
            default: throw new IllegalArgumentException("illegal signature");
        }
    }

    ObjectStreamField(Field field, boolean unshared, boolean showType) {
        this.field = field;
        this.unshared = unshared;
        name = field.getName();
        Class<?> ftype = field.getType();
        type = (showType || ftype.isPrimitive()) ? ftype : Object.class;
        signature = "";//getClassSignature(ftype).intern();
    }

    public int compareTo(Object o) {
        throw new RuntimeException("Implementation please");
    }

    public char getTypeCode() {
        return signature.charAt(0);
    }

    protected void setOffset(int offset) {
        this.offset = offset;
    }

    public int getOffset() {
        return offset;
    }

    String getSignature() {
        return signature;
    }

    public String getName() {
        return name;
    }

    public boolean isPrimitive() {
        char tcode = signature.charAt(0);
        return ((tcode != 'L') && (tcode != '['));
    }

    Field getField() {
        return field;
    }

    public boolean isUnshared() {
        return unshared;
    }
}
