package com.self.pet;

import java.io.File;
import java.io.FileOutputStream;
import java.io.IOException;
import java.io.OutputStream;
import java.lang.reflect.Field;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.Collection;
import java.util.Collections;
import java.util.Date;
import java.util.Iterator;
import java.util.LinkedList;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;
import java.util.stream.Stream;
import java.lang.reflect.Modifier;

//ch.axonivy.fintech.standard.core.util.Decompressor

public class Decompressor {

	private static final SimpleDateFormat formatter = new SimpleDateFormat("dd-MM-yyyy");

	public static String blow(Object input) {
		return new Decompressor().decompress(input);
	}

	public void decompress(Object subject, String output) {
		if (subject == null) {
			return;
		}
		try (FileOutputStream fos = new FileOutputStream(new File(output))) {
			decompress(subject, new StreamWriter(fos));
		} catch (Exception e) {
			throw new DecompressException(e);
		}
	}

	private void decompress(Object subject, FlushableWriter writer) {
		LinkedList<Integer> footprint = new LinkedList<>();
		LinkedList<Node> workingStack = new LinkedList<>();
		footprint.push(subject.hashCode());
		workingStack.push(turnToNode(subject).markAtTail().setDeep(1));
		while ( ! workingStack.isEmpty()) {
			Node head = workingStack.peek();
			if (head.isOutGoing) {
				writer.write(head.getRearPart());
				workingStack.pop();
				footprint.pop();
			} else {
				if (head.deep > 15) {
					if (head instanceof KeyLeadNode) {

					} else {
						if (head.isCollectionTail) {
							writer.write("null");
						} else {
							writer.write("null,");
						}
					}
					workingStack.pop();
					footprint.pop();
					continue;
				}
				writer.write(head.getFrontPart());
				head.turnAround();
				for (Node child: head.getChildren()) {
					child.setDeep(head.deep + 1);
					int hashCode = child.hashCode();
//					if (hashCode != 0 && footprint.contains(hashCode)) {
					if (false){
						footprint.push(0);
						workingStack.push(new NullNode().markAtTail());
					} else {
						footprint.push(hashCode);
						workingStack.push(child);
					}
				}
			}
			writer.flush();
		}
	}

	public String decompress(Object subject) {
		if (subject == null) {
			return "null";
		}
		StringBuilder sb = new StringBuilder(10000);
		decompress(subject, new AppendingWriter(sb));
		return sb.toString();
	}

	@SuppressWarnings("rawtypes")
	private static Node turnToNode(Object subject) {
		if (subject == null) {
			return new NullNode();
		}
		if (subject instanceof Map) {
			return new MapNode((Map) subject);
		}
		if (subject instanceof Collection) {
			return new CollectionNode((Collection)subject);
		}
		if (subject instanceof String) {
			return new StringNode((String)subject);
		}
		if (subject instanceof Date) {
			return new DateNode((Date) subject);
		}
		if (subject instanceof Boolean || subject.getClass() == Boolean.TYPE) {
			return new BooleanNode((Boolean)subject);
		}
		if (isNumber(subject)) {
			return new NumberNode(subject);
		}
		return new ObjectNode(subject);
	}

	private static boolean isNumber(Object subject) {
		Class<?> type = subject.getClass();
		if (type == Number.class) {
			return true;
		}
		if (type == Integer.class || type == Integer.TYPE) {
			return true;
		}
		if (type == Long.class || type == Long.TYPE) {
			return true;
		}
		if (type == Float.class || type == Float.TYPE) {
			return true;
		}
		if (type == Double.class || type == Double.TYPE) {
			return true;
		}
		return false;
	}

	private static String cook(Object input) {
		return (""+input).replace("\\", "\\\\").replace("\"", "\\\"");
	}


	private static interface FlushableWriter {
		void write(String input);
		void flush();
	}

	private static class StreamWriter implements FlushableWriter {
		private OutputStream outputStream;

		public StreamWriter(OutputStream outputStream) {
			this.outputStream = outputStream;
		}

		@Override
		public void write(String input) {
			try {
				outputStream.write(input.getBytes());
			} catch (IOException e) {
				throw new DecompressException(e);
			}
		}

		@Override
		public void flush() {
			try {
				outputStream.flush();
			} catch (IOException e) {
				throw new DecompressException(e);
			}
		}
	}

	private static class AppendingWriter implements FlushableWriter {
		private StringBuilder builder;

		public AppendingWriter(StringBuilder builder) {
			this.builder = builder;
		}

		@Override
		public void write(String input) {
			builder.append(input);
		}

		@Override
		public void flush() {
			// do nothing
		}
	}

	private abstract static class Node {
		protected boolean isCollectionTail;
		protected boolean isOutGoing;
		protected int deep;

		abstract String getFrontPart();
		abstract int getSubjectHashCode();

		public String getRearPart() {
			if (isCollectionTail) {
				return getBaseRearPart();
			}
			return getBaseRearPart() + ",";
		}

		public  String getBaseRearPart() {
			return "";
		}

		public List<Node> getChildren() {
			return Collections.emptyList();
		}

		public Node markAtTail() {
			this.isCollectionTail = true;
			return this;
		}

		public Node turnAround() {
			this.isOutGoing = true;
			return this;
		}

		@Override
		public int hashCode() {
			return getSubjectHashCode();
		}

		public Node setDeep(int deep) {
			this.deep = deep;
			return this;
		}
	}

	private static class ObjectNode extends Node {
		private Object subject;

		public ObjectNode(Object subject) {
			this.subject = subject;
		}

		@Override
		public String getFrontPart() {
			return "{";
		}

		@Override
		public String getBaseRearPart() {
			return "}";
		}

		@Override
		public List<Node> getChildren() {
			LinkedList<Node> out = new LinkedList<>();
			Iterator<Field> fieldsIte = getFields(subject).iterator();
			while (fieldsIte.hasNext()) {
				Field field = fieldsIte.next();
				try {
					out.push(new KeyLeadNode(field.getName(), field.get(subject)));
				} catch (IllegalArgumentException | IllegalAccessException e) {
					throw new DecompressException(e);
				}
			}
			if (!out.isEmpty())
				out.peek().markAtTail();
			return out;
		}

		private List<Field> getFields(Object obj) {
			Class<?> targetClass = obj.getClass();
			List<Field> fields = new ArrayList<>();
			while (targetClass != Object.class) {
				List<Field> currentFields = Stream.of(targetClass.getDeclaredFields())
													.filter(f -> ! Modifier.isStatic(f.getModifiers()))
													.filter(f -> fields.stream().noneMatch(h -> h.getName().equals(f.getName())))
													.peek(f -> f.setAccessible(true))
													.collect(Collectors.toList());
				fields.addAll(currentFields);
				targetClass = targetClass.getSuperclass();
			}
			return fields;
		}

		@Override
		int getSubjectHashCode() {
			return subject.hashCode();
		}
	}

	private static class KeyLeadNode extends Node {
		private Object key;
		private Object value;

		public KeyLeadNode(Object key, Object value) {
			this.key = key;
			this.value = value;
		}

		@Override
		String getFrontPart() {
			return "\""+cook(String.valueOf(key))+"\":";
		}

		@Override
		public List<Node> getChildren() {
			return Arrays.asList(turnToNode(value).markAtTail());
		}

		@Override
		int getSubjectHashCode() {
			int khc = key == null ? 0 : key.hashCode();
			int vhc = value == null ? 0 : value.hashCode();
			return (khc+"__:__"+vhc).hashCode();
		}
	}

	private static class MapNode extends Node {
		@SuppressWarnings("rawtypes")
		private Map subject;

		@SuppressWarnings("rawtypes")
		public MapNode(Map subject) {
			this.subject = subject;
		}

		@Override
		String getFrontPart() {
			return "{";
		}

		@Override
		public String getBaseRearPart() {
			return "}";
		}

		@SuppressWarnings({ "unchecked", "rawtypes" })
		@Override
		public List<Node> getChildren() {
			try {
				subject.entrySet();
			} catch (UnsupportedOperationException e) {
				return Collections.emptyList();
			}
			LinkedList<Node> out = new LinkedList<>();
			Iterator<Map.Entry> ite = subject.entrySet().iterator();
			Map.Entry entry;
			while (ite.hasNext()) {
				entry = ite.next();
				out.push(new KeyLeadNode(entry.getKey(), entry.getValue()));
			}
			if (!out.isEmpty())
				out.peek().markAtTail();
			return out;
		}

		@Override
		int getSubjectHashCode() {
			return subject.hashCode();
		}
	}

	private static class CollectionNode extends Node {
		@SuppressWarnings("rawtypes")
		private Collection subject;

		@SuppressWarnings("rawtypes")
		public CollectionNode(Collection subject) {
			this.subject = subject;
		}

		@Override
		public String getFrontPart() {
			return "[";
		}

		@Override
		public String getBaseRearPart() {
			return "]";
		}

		@SuppressWarnings("rawtypes")
		@Override
		public List<Node> getChildren() {
			LinkedList<Node> out = new LinkedList<>();
			Iterator ite = subject.iterator();
			while(ite.hasNext()) {
				out.push(turnToNode(ite.next()));
			}
			if (!out.isEmpty())
				out.peek().markAtTail();
			return out;
		}

		@Override
		int getSubjectHashCode() {
			return subject.hashCode();
		}
	}

	private static class NumberNode extends Node {

		private Object val;

		public NumberNode(Object val) {
			this.val = val;
		}

		@Override
		String getFrontPart() {
			return ""+val;
		}

		@Override
		int getSubjectHashCode() {
			return val.hashCode();
		}
	}

	private static class BooleanNode extends Node {
		Boolean val;

		public BooleanNode(Boolean val) {
			this.val = val;
		}

		@Override
		String getFrontPart() {
			return val ? "true" : "false";
		}

		@Override
		int getSubjectHashCode() {
			return val.hashCode();
		}

	}

	private static class StringNode extends Node {
		private String val;

		public StringNode(String val) {
			this.val = val;
		}

		@Override
		public String getFrontPart() {
			return "\""+cook(val);
		}

		@Override
		public String getBaseRearPart() {
			return "\"";
		}

		@Override
		int getSubjectHashCode() {
			return val.hashCode();
		}
	}

	private static class DateNode extends Node {
		private Date val;

		public DateNode(Date val) {
			this.val = val;
		}

		@Override
		String getFrontPart() {
			return "\""+formatter.format(val);
		}

		@Override
		public String getBaseRearPart() {
			return "\"";
		}

		@Override
		int getSubjectHashCode() {
			return val.hashCode();
		}
	}

	private static class NullNode extends Node {
		@Override
		public String getFrontPart() {
			return "null";
		}

		@Override
		int getSubjectHashCode() {
			return 0;
		}
	}

	private static class DecompressException extends RuntimeException {
		private static final long serialVersionUID = -2547406447124207858L;

		public DecompressException(Throwable cause) {
			super(cause);
		}
	}

	public static void main(String[] args) {
		LinkedList<Integer> x = new LinkedList<>();
		x.push(8);
		x.push(2);
		x.push(1);
		for (Integer i: x) {
			System.out.println("forIte base: " + i);
		}
	}
}
