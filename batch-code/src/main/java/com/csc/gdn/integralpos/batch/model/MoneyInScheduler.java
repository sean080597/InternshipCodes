package com.csc.gdn.integralpos.batch.model;

import javax.xml.bind.annotation.XmlAccessType;
import javax.xml.bind.annotation.XmlAccessorType;
import javax.xml.bind.annotation.XmlElement;
import javax.xml.bind.annotation.XmlRootElement;
import javax.xml.bind.annotation.XmlType;

import lombok.Data;

@Data
@XmlAccessorType(XmlAccessType.FIELD)
@XmlType(name = "", propOrder = {
	"lastPayment",
	"paymentMethod"
})
@XmlRootElement(name = "MoneyInScheduler")
public class MoneyInScheduler {
	@XmlElement(name = "lastPayment")
    protected LastPayment lastPayment;
	
	@XmlElement(name = "paymentMethod")
    protected PaymentMethod paymentMethod;
}
