package com.example.batchjob.listener;

import java.util.List;

import org.owasp.security.logging.util.SecurityUtil;
import org.springframework.batch.core.listener.ItemListenerSupport;

public class GenericItemListener<I, O> extends ItemListenerSupport<I, O>{

	@Override
	public void beforeRead() {
		SecurityUtil.logMessage("Encountered beforeRead");
	}
	
	@Override
	public void beforeProcess(I item) {
		SecurityUtil.logMessage("Encountered beforeProcess");
	}
	
	@Override
	public void beforeWrite(List<? extends O> item) {
		SecurityUtil.logMessage("Encountered beforeWrite");
	}
	
	@Override
	public void afterRead(I item) {
		SecurityUtil.logMessage("Encountered afterRead");
	}
	
	@Override
	public void afterProcess(I item, O result) {
		SecurityUtil.logMessage("Encountered afterProcess");
	}
	
	@Override
	public void afterWrite(List<? extends O> item) {
		SecurityUtil.logMessage("Encountered afterWrite");
	}
	
	@Override
    public void onReadError(Exception ex) {
        SecurityUtil.logMessage("Encountered error on read: " + ex);
    }

	@Override
    public void onProcessError(I items, Exception ex) {
		SecurityUtil.logMessage("Encountered error on process: " + ex);
    }
	
    @Override
    public void onWriteError(Exception ex, List<? extends O> item) {
    	SecurityUtil.logMessage("Encountered error on write: " + ex);
    }
}
