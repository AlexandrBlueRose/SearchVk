package controller;

import java.io.FileInputStream;
import java.io.InputStream;
import java.lang.management.ManagementFactory;
import java.lang.management.MemoryMXBean;
import java.lang.management.MemoryUsage;
import java.text.NumberFormat;
import java.util.ArrayList;
import java.util.logging.Level;
import java.util.logging.LogManager;
import java.util.logging.Logger;
import javax.swing.JFrame;
import javax.swing.JInternalFrame;

import java.lang.management.MemoryUsage;

import model.Engine;
import view.DrawFrame;
import view.FileSystem;
import view.Viewer;


public class Main {
	//�������
	public static boolean admin=true;
	public static final boolean shortView=false;
	public static final Logger log = Logger.getLogger(Main.class.getName());
	static Engine eng;
	public static void logInfo(String message)
	{
		if(admin==true)
			log.info(message);
	}
	public static void logSevere(String message, Exception e)
	{
		if(admin==true)
			log.log(Level.SEVERE,message,e);
	}
	public static void logFine(String message)
	{
		if(admin==true)
			log.fine(message);
	}
        
        public void inputGenerateData(int first,int second, int[][] engIn){
            for(int i=0;i<first;i++){
                for(int j=0;j<second;j++){
                    
                }
                
            }
        }
        //private static boolean logged = false;//login check
        private static String login = "admin";
        private static String Password = "admin";
        public static Viewer viewer;
        public static void main(String[] args) throws Exception {
    		// TODO Auto-generated method stub
        	//GMailSender sender = new GMailSender("consoleLogHelloWorld02@gmail.com", "Fantihon00");
            //sender.sendMail("Attention",
                    //"System attention! Your memory is crammed!",
                    //"consoleLogHelloWorld02@gmail.com",
                    //"7105581@mail.ru");
    		//InputStream inputStream0 = new FileInputStream("logging.properties");
    		//LogManager.getLogManager().readConfiguration(inputStream0);
    		//inputStream0.close();
    		//inputStream0=null;
    		//цикл
    		Boolean successful=true;
    		FileSystem fileSys = new FileSystem();
    		try {
    			successful = fileSys.loadProperties();
    			if(successful==false)
    				//throw new Exception("properties error! loadProperties");
    				logInfo("Main: properties error! loadProperties");
    			else
    				logFine("Main: loadProperties successful");
    		} catch (Exception e) {
    			logSevere("Main: properties critical error! loadProperties", e);
    		}
    		eng = new Engine();
    		successful = eng.start();
    		if(successful==false)
    		{
    			logInfo("Main: Engine.start error!");
    			throw new Exception("Engine.start error!");
    		}
    		else
    		{
    			logFine("Main: Engine.start successful");
    		}
    		Double wsize=new Double(0);
    		if(admin==true)
    		{
    		for(int x=0;x<eng.getMap().getSizeX();x++)
    			for(int y=0;y<eng.getMap().getSizeY();y++)
    				for(int z=0;z<eng.getMap().getSizeZ();z++)
    					wsize+=eng.getMap().getNode(x, y, z).getWaterLevel();
    		logFine("waterLevel start = " + wsize.toString());
    		//System.out.println(wsize);
    		}
    		Controller controller=new Controller();
    		successful = controller.start();
    		if(successful==false)
    		{
    			logInfo("Main: controller.start error!");
    			throw new Exception("controller.start error!");
    		}
    		else
    		{
    			logFine("Main: controller.start successful");
    		}
    		Message message0;
    		viewer = new Viewer();
    		successful = viewer.start();
    		if(successful==false)
    		{
    			logInfo("Main: viewer.start error!");
    			throw new Exception("viewer.start error!");
    		}
    		else
    		{
    			logFine("Main: viewer.start successful");
    		}
    		try {
    			successful = viewer.loadWindows(fileSys);
    			if(successful ==false)
    				logInfo("Main: viewer.loadWindaws error!");
    			else
    				logFine("Main: viewer.loadWindaws successful");
    		} catch (Exception e) {
    			logSevere("Main: viewer.loadWindaws critical error!", e);
    			viewer.defaltProperties();
    		}
    		try {
    			viewer.view(eng, shortView,2,3);
    		} catch (Exception e) {
    			logSevere("Main: start viewer.view Error! ", e);
    		}
    		
    		//тест properties
    		/*
    		successful = viewer.saveWindaws(fileSys);
    		if(successful==false)
    		{
    			throw new Exception("properties error! saveWindaws");
    		}
    		successful=fileSys.saveProperties();
    		if(successful==false)
    		{
    			throw new Exception("properties error! saveProperties");
    		}
    		*/
    		//
    		long round = 0;
    		//while(eng.isEnd()==false)
    		{
    			message0 = controller.run(successful);
    			if(successful==false)
    			{
    				message0.setModeModel(0);
    				logInfo("controller error! in step " + Long.toString(round) + "end program");
    			}
    			else
    			{
    				logFine("controller successful in step " + Long.toString(round));
    			}
    			eng.setMessage(message0);
    			if(eng.isEnd()==false)
    				eng.run();
    			//вывод
    			try {
    				viewer.view(eng, shortView,2,0);
    			} catch (Exception e) {
    				logSevere("Main: viewer.view Error! in step " + Long.toString(round) + ": ", e);
    			}
    			//проверка кол-ва воды
    			if(admin==true)
    			{
    			wsize=(double) 0;
    			for(int x=0;x<eng.getMap().getSizeX();x++)
    				for(int y=0;y<eng.getMap().getSizeY();y++)
    					for(int z=0;z<eng.getMap().getSizeZ();z++)
    						wsize+=eng.getMap().getNode(x, y, z).getWaterLevel();
    			//System.out.println(wsize);
    			logFine("waterLevel №" + Long.toString(round) + " = " + wsize.toString());
    			}
    			round++;
    		}
    		controller.end();
    	}
    	//
	//
        public static void Test2() throws Exception{
            //цикл который проходит несколько раз создание и обработку карты
            //начальные и конечные промежутки времени
            //для создания карты
             long startTimerCreate=0;
             long stopTimerCreate=0;
             long startTimerCreate2=0;
             long stopTimerCreate2=0;
             sytemInfo infoSyst = new sytemInfo();
             int index=0;
             int index2=0;
             int engXYZF=20;
             ArrayList<Float> time1=new ArrayList();
             ArrayList<Float> time2=new ArrayList();
             time2.add(0F);
            // time1.add(0F);
            //начало основного цикла (создания и обработки нескольких карт)
             long inf=(long) ((infoSyst.FreeMem()/100)*30);
             long infEm=(long) ((infoSyst.FreeMem()/100)*10);
            for(int j=0;;j++){
                index++;
            //засекаем начальную точку времени
            startTimerCreate=System.nanoTime();
            /*
            OutOfMemoryError выбрасывается, когда виртуальная машина Java не может выделить (разместить) объект из-за нехватки памяти, 
            а сборщик мусора не может высвободить ещё.
            Область памяти, занимаемая java процессом, состоит из нескольких частей. 
            Тип OutOfMemoryError зависит от того, в какой из них не хватило места.
            */
           
            Engine eng = new Engine(engXYZF,engXYZF,engXYZF,engXYZF/2,engXYZF-1); 
            engXYZF+=20;
            //long inf=(infoSyst.FreeMem()/10000)*9999;
            long inf2=infoSyst.FreeMem();
            System.out.println(infoSyst.FreeMem());
            System.out.println(inf);   
            System.out.println(infoSyst.totalMem());
           // System.out.println(infoSyst.FreeMem());
            if(inf2<inf){
                break;
            }
         
	 //создаем и инициализируем Engine 
             //MemoryMXBean memoryBean = ManagementFactory.getMemoryMXBean();
            try{
            
            eng.start();
            }
            catch (OutOfMemoryError e) 
            {
                //MemoryUsage heapUsage = memoryBean.getHeapMemoryUsage();
                //long maxMemory = heapUsage.getMax() ;
                //long usedMemory = heapUsage.getUsed();
               // System.out.println(" : Memory Use :" + usedMemory + "M/" + maxMemory + "M");
            }
            
	Double wsize=new Double(0);
	if(admin==true)
	{
	for(int x=0;x<eng.getMap().getSizeX();x++)
		for(int y=0;y<eng.getMap().getSizeY();y++)
			for(int z=0;z<eng.getMap().getSizeZ();z++)
				wsize+=eng.getMap().getNode(x, y, z).getWaterLevel();
	logFine("waterLevel start = " + wsize.toString());
	//System.out.println(wsize);
	}
	Controller controller=new Controller();
            //останавливаем таймер
            stopTimerCreate=System.nanoTime();
             
            //выводим сообщение с подсчитанным временем(промежуток от начала до конца)
            System.out.println("time: "+String.format("%,12d",(stopTimerCreate-startTimerCreate))+" ns");           
	long round = 0;
            long  stat=(stopTimerCreate-startTimerCreate)/1000000;
            System.out.println(stat);
            time1.add((float)(stopTimerCreate-startTimerCreate)/1000000);
            stopTimerCreate=0;
            startTimerCreate=0;
            if(stat>4000){
                break;
            }
            if((stat>3000)||(infEm>inf2)){
                //GMailSender sender = new GMailSender("consoleLogHelloWorld02@gmail.com", "Fantihon00");
                //sender.sendMail("Attention",
                        //"System attention! Your memory is crammed!",
                        //"consoleLogHelloWorld02@gmail.com",
                        //"7105581@mail.ru");
                //}
            int sum=0;
            //цикл прохода алгоритма взаимодействия воды и карты
            for(int i=0;i<5;i++)
                
	{
                index2++;
                startTimerCreate2=System.nanoTime();
                long inf3=infoSyst.FreeMem();
                
                if(inf3<inf){
                break;
            }
                /*
                */
                //startTimerStep[j][i]=System.nanoTime();
                //
		if(eng.isEnd()==false)
			eng.run();
		try {
			//viewer.view(eng, shortView,2,3);
		} catch (Exception e) {
			logSevere("Main: viewer.view Error! in step " + Long.toString(round) + ": ", e);
		}
		if(admin==true)
		{
		wsize=(double) 0;
		for(int x=0;x<eng.getMap().getSizeX();x++)
			for(int y=0;y<eng.getMap().getSizeY();y++)
				for(int z=0;z<eng.getMap().getSizeZ();z++)
					wsize+=eng.getMap().getNode(x, y, z).getWaterLevel();
		//System.out.println(wsize);
		logFine("waterLevel �" + Long.toString(round) + " = " + wsize.toString());
		}
		round++;
                    //останавливаем время
                    //stopTimerStep[j][i]=System.nanoTime();
                    
                    //выводим результаты по времени выполнения для одного шага
                   // System.out.println("time: "+String.format("%,12d",(stopTimerStep[j][i]-startTimerStep[j][i]))+" ns");
stopTimerCreate2=System.nanoTime();
                    System.out.println("time: "+String.format("%,12d",(stopTimerCreate2-startTimerCreate2))+" ns");           
	long round2 = 0;
            long  stat2=(stopTimerCreate2-startTimerCreate2)/1000000;
            System.out.println(stat2);
            sum+=((stopTimerCreate2-startTimerCreate2)/1000000);
            stopTimerCreate=0;
            startTimerCreate=0;
	}
            time2.add((float)sum/5);
	controller.end();
            }
            System.out.println();
            int Yz=0;
            time1.set(0,0F);
            ArrayList<Float> y12=new ArrayList();
            ArrayList<Float> y22=new ArrayList();
           // y12.add(0F);
            for(int i=0;i<index;i++){
                Yz+=20;
                y12.add((float)Yz);
            }
            for(int i=0;i<index2;i++){
                y22.add((float)i);
            }
            viewer.Graf(time1, y12, time2, y12);
            viewer.drawFrame.DG.repaint();
            viewer.drawFrame.setVisible(true);
           // viewer.getDATAGraph(aTime, z,bTime,z);
            sytemInfo infoSys = new sytemInfo();
           System.out.println(infoSys.usedMem());
           System.out.println(infoSys.MemInfo());
           System.out.println(infoSys.OSname());
           System.out.println(infoSys.OSversion());
           /////JInternalFrame frame = new DrawFrame(time1,y12,time2,y12);
           //frame.setTitle("DrawTest");
           //frame.setDefaultCloseOperation(JFrame.EXIT_ON_CLOSE);
          // frame.setVisible(true);
           System.out.print("");}
    }
        public static int AutoTest() throws InterruptedException{
            //цикл который проходит несколько раз создание и обработку карты
            //начальные и конечные промежутки времени
            //для создания карты
        	long  stat=0;
             long startTimerCreate=0;
             long stopTimerCreate=0;
             long startTimerCreate2=0;
             long stopTimerCreate2=0;
             sytemInfo infoSyst = new sytemInfo();
             int index=0;
             int index2=0;
             int engXYZF=20;
             ArrayList<Float> time1=new ArrayList();
             ArrayList<Float> time2=new ArrayList();
             time2.add(0F);
            // time1.add(0F);
            //начало основного цикла (создания и обработки нескольких карт)
             long inf=(long) ((infoSyst.FreeMem()/100)*30);
             long infEm=(long) ((infoSyst.FreeMem()/100)*30);
            for(int j=0;;j++){
                index++;
            //засекаем начальную точку времени
            startTimerCreate=System.nanoTime();
            /*
            OutOfMemoryError выбрасывается, когда виртуальная машина Java не может выделить (разместить) объект из-за нехватки памяти, 
            а сборщик мусора не может высвободить ещё.
            Область памяти, занимаемая java процессом, состоит из нескольких частей. 
            Тип OutOfMemoryError зависит от того, в какой из них не хватило места.
            */
           
            Engine eng = new Engine(engXYZF,engXYZF,engXYZF,engXYZF/2,engXYZF-1); 
            engXYZF+=20;
            //long inf=(infoSyst.FreeMem()/10000)*9999;
            long inf2=infoSyst.FreeMem();
            if(inf2<inf){
                break;
            }
         
	 //создаем и инициализируем Engine 
             //MemoryMXBean memoryBean = ManagementFactory.getMemoryMXBean();
            try{
            
            eng.start();
            }
            catch (OutOfMemoryError e) 
            {
                //MemoryUsage heapUsage = memoryBean.getHeapMemoryUsage();
                //long maxMemory = heapUsage.getMax() ;
                //long usedMemory = heapUsage.getUsed();
               // System.out.println(" : Memory Use :" + usedMemory + "M/" + maxMemory + "M");
            }
            
	Double wsize=new Double(0);
	if(admin==true)
	{
	for(int x=0;x<eng.getMap().getSizeX();x++)
		for(int y=0;y<eng.getMap().getSizeY();y++)
			for(int z=0;z<eng.getMap().getSizeZ();z++)
				wsize+=eng.getMap().getNode(x, y, z).getWaterLevel();
	//System.out.println(wsize);
	}
	Controller controller=new Controller();
            //останавливаем таймер
            stopTimerCreate=System.nanoTime();
             long round = 0;
             stat=(stopTimerCreate-startTimerCreate)/1000000;
            time1.add((float)(stopTimerCreate-startTimerCreate)/1000000);
            stopTimerCreate=0;
            startTimerCreate=0;
            if(stat>4000){

               // return engXYZF;
                break;
            }
            int sum=0;
            //цикл прохода алгоритма взаимодействия воды и карты
            for(int i=0;i<5;i++)
                
	{
                index2++;
                startTimerCreate2=System.nanoTime();
                long inf3=infoSyst.FreeMem();
                
                if(inf3<inf){
                break;
            }
                /*
                */
                //startTimerStep[j][i]=System.nanoTime();
                //
		if(eng.isEnd()==false)
			eng.run();
		if(admin==true)
		{
		wsize=(double) 0;
		for(int x=0;x<eng.getMap().getSizeX();x++)
			for(int y=0;y<eng.getMap().getSizeY();y++)
				for(int z=0;z<eng.getMap().getSizeZ();z++)
					wsize+=eng.getMap().getNode(x, y, z).getWaterLevel();
		//System.out.println(wsize);
		
		}
		round++;
                    //останавливаем время
                    //stopTimerStep[j][i]=System.nanoTime();
                    
                    //выводим результаты по времени выполнения для одного шага
                   // System.out.println("time: "+String.format("%,12d",(stopTimerStep[j][i]-startTimerStep[j][i]))+" ns");
stopTimerCreate2=System.nanoTime();
            long round2 = 0;
            long  stat2=(stopTimerCreate2-startTimerCreate2)/1000000;
            
            sum+=((stopTimerCreate2-startTimerCreate2)/1000000);
            stopTimerCreate=0;
            startTimerCreate=0;
	}
            time2.add((float)sum/5);
	controller.end();
            }
            int Yz=0;
            time1.set(0,0F);
            ArrayList<Float> y12=new ArrayList();
            ArrayList<Float> y22=new ArrayList();
           // y12.add(0F);
            for(int i=0;i<index;i++){
                Yz+=20;
                y12.add((float)Yz);
            }
            for(int i=0;i<index2;i++){
                y22.add((float)i);
            }
           
           // viewer.getDATAGraph(aTime, z,bTime,z);
           /////JInternalFrame frame = new DrawFrame(time1,y12,time2,y12);
           //frame.setTitle("DrawTest");
           //frame.setDefaultCloseOperation(JFrame.EXIT_ON_CLOSE);
          // frame.setVisible(true);
            return engXYZF;
    }
        public static void engRun(int repeats) throws InterruptedException {
        	for(int i = 0; i < repeats; i++)
        		eng.run();
        	viewer.view(eng, shortView,viewer.getMode(),viewer.getLevel());
        	System.out.println("water calculation algorithm launched " + repeats + " times");
        	
        }
        public static boolean tryLogin(String logininp, String passwordinp) {    	
        		viewer.showMenu(logininp.equals(login) && passwordinp.equals(Password));
        		return logininp.equals(login) && passwordinp.equals(Password);
        	
        }
}