package com.csc.gdn.integralpos.batch.model;

import javax.xml.bind.annotation.XmlAccessType;
import javax.xml.bind.annotation.XmlAccessorType;
import javax.xml.bind.annotation.XmlRootElement;
import javax.xml.bind.annotation.XmlType;

import lombok.Data;

@Data
@XmlAccessorType(XmlAccessType.FIELD)
@XmlType(name = "", propOrder = {
	"tokenIndicator",
	"token",
	"tokenDeclarationDate",
	"tokenCreationDate"
})
@XmlRootElement(name = "tokenDetails")
public class TokenDetails {
	protected String tokenIndicator;
	protected String token;
	protected String tokenDeclarationDate;
	protected String tokenCreationDate;
}
