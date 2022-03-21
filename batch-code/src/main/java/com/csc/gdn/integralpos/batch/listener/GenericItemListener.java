package com.csc.gdn.integralpos.batch.listener;

import java.util.List;

import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.springframework.batch.core.listener.ItemListenerSupport;

public class GenericItemListener<I, O> extends ItemListenerSupport<I, O>{
	private Log logger;
	
	public <T> GenericItemListener(Class<T> logName) {
		logger = LogFactory.getLog(logName);
	}

	@Override
	public void beforeRead() {
		logger.info("Encountered beforeRead");
	}
	
	@Override
	public void beforeProcess(I item) {
		logger.info("Encountered beforeProcess");
	}
	
	@Override
	public void beforeWrite(List<? extends O> item) {
		logger.info("Encountered beforeWrite");
	}
	
	@Override
	public void afterRead(I item) {
		logger.info("Encountered afterRead");
	}
	
	@Override
	public void afterProcess(I item, O result) {
		logger.info("Encountered afterProcess");
	}
	
	@Override
	public void afterWrite(List<? extends O> item) {
		logger.info("Encountered afterWrite");
	}
	
	@Override
    public void onReadError(Exception ex) {
        logger.error("Encountered error on read", ex);
    }

	@Override
    public void onProcessError(I items, Exception ex) {
		logger.error("Encountered error on process", ex);
    }
	
    @Override
    public void onWriteError(Exception ex, List<? extends O> item) {
    	logger.error("Encountered error on write", ex);
    }
}
