package com.self.pet;


import java.io.File;
import java.io.InputStream;
import java.io.ByteArrayInputStream;
import org.apache.commons.io.FileUtils;

public class App 
{
    public static void main( String[] args ){ }

    public static void run() throws Exception {
        File f = new File("proto.txt");
        byte[] wrapperBytesArray = FileUtils.readFileToByteArray(f);
        InputStream inputStream = new ByteArrayInputStream(wrapperBytesArray);
        Object o = new Reader(inputStream).readObject();
        System.out.println(" #### <> ####");
        System.out.println(Decompressor.blow(o));
        System.out.println(" #### <> ####");
    }
}
