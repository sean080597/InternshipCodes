package com.csc.gdn.integralpos.batch.constant;

import java.util.ArrayList;
import java.util.Arrays;

public class BatchConstants {
	
	public static final String QUOTATION_INDEX = "quotation";
	public static final String QUOTATION_TYPE = "quotations";
	public static final String PAYMENT_INDEX = "payment";
	public static final String PAYMENT_TYPE = "payments";
	public static final String RECON_INDEX = "reconci";
	public static final String RECON_TYPE = "reconciliation";
	public static final String POST_CODE_INDEX = "postal_code_config";
	public static final String POST_CODE_TYPE = "config";
	public static final String OTP = "otp";
	public static final String BATCH_NAME = "batchname";
	public static final String TO_EMAIL = "toEmail";
	public static final String ATTACHMENT_ID = "AttachmentID";
	public static final String SORT_ASCENDING = "ASCENDING";
	public static final String SORT_DESCENDING = "DESCENDING";
	
	public static final String DATE_FORMAT = "yyyy-MM-dd";
	public static final String DATE_FORMAT2 = "yyyy-MM-dd_HH.mm.ss";
	public static final String DATE_FORMAT3 = "yyyy-MM-dd HH:mm:ss";
	public static final String DATE_FORMAT4 = "yyyyMMddHHmmss";
	public static final String DATE_FORMAT5 = "dd MMM yyyy";
	public static final String DATE_FORMAT6 = "EEE MMM dd HH:mm:ss z yyyy";
	public static final String DATE_FORMAT7 = "yyyyMMdd";
	public static final String DATE_FORMAT_ES = "yyyy-MM-dd'T'HH:mm:ssZ";
	public static final String DATE_FORMAT_TIMESTAMP = "yyyyMMddHHmmssSSS";
	public static final String DATE_FORMAT_JPJ_RESPONSE = "dd/MM/yyyy";
	
	public static final String PENDING_QUOTATION = "PENDING_QUOTATION";
	public static final String PENDING_PROPOSAL = "PENDING_PROPOSAL";
	public static final String PENDING_PAYMENT = "PENDING_PAYMENT";
	public static final String PENDING_REVIEW = "PENDING_REVIEW";
	public static final String REVIEWED_REJECTED = "REVIEWED_REJECTED";
	public static final String REVIEWED_APPROVED = "REVIEWED_APPROVED";
	public static final String REVIEWED_LOADING = "REVIEWED_LOADING";
	public static final String REVIEWED_LOADING_REJECTED = "REVIEWED_REJECTED";
	public static final String REFERRED_CODE = "REFERRED";
	public static final String REFERRED_DESC = "Referred";
	public static final String REJECTED_CODE = "REJECTED";
	public static final String REJECTED_DESC = "Rejected";
	public static final String EXPIRED_CODE = "EXPIRED";
	public static final String EXPIRED_DESC = "Expired";
	public static final String DRAFT_CODE = "DRAFT";
	public static final String DRAFT_DESC = "Draft";
	public static final String COMPLETE_CODE = "COMPLETE";
	public static final String COMPLETE_DESC = "Completed Quotation";
	public static final String POLICY_ISSUED = "POLICY_ISSUED";
	public static final String POLICY_ISSUED_DESC = "Policy Issued";
	public static final String INFORCE_CODE = "INFORCE";
	public static final String INFORCE_DESC = "In-force Policy";
	public static final String PAYMENT_COMPLETE_CODE = "PAYMENT_COMPLETED";
	public static final String PAYMENT_COMPLETE_DESC = "Payment Completed";
	public static final String EPAY_RECOVERED = "Recovered";
	public static final String EPAY_NO_ACTION = "No Action";
	
	/* Payment Operation status */
	public static final String PAYMENT_OPERATION_NA_CODE ="0";
	public static final String PAYMENT_OPERATION_NA_DESC ="N/A";
	public static final String PAYMENT_OPERATION_AUTH_CODE ="1";
	public static final String PAYMENT_OPERATION_AUTH_DESC ="Auth";
	public static final String PAYMENT_OPERATION_CAPTURE_CODE ="2";
	public static final String PAYMENT_OPERATION_CAPTURE_DESC ="Capture";
	public static final String PAYMENT_OPERATION_REFUND_CODE ="3";
	public static final String PAYMENT_OPERATION_REFUND_DESC ="Refund";
	public static final String PAYMENT_OPERATION_COMPLETED_CODE ="4";
	public static final String PAYMENT_OPERATION_COMPLETED_DESC ="Completed";
	public static final String PAYMENT_OPERATION_SETTLED_CODE ="4";
	public static final String PAYMENT_OPERATION_SETTLED_DESC ="Settled";
	public static final String PAYMENT_OPERATION_IN_PROGRESS_CODE ="5";
	public static final String PAYMENT_OPERATION_IN_PROGRESS_DESC ="In-Progress";
	
	/* Payment Business status */
	public static final String PAYMENT_BUSINESS_COMPLETED_CODE ="COMPLETE";
	public static final String PAYMENT_BUSINESS_COMPLETED_DESC ="Completed Payment";
	public static final String PAYMENT_BUSINESS_DRAFT_CODE ="DRAFT";
	public static final String PAYMENT_BUSINESS_DRAFT_DESC ="Draft";
	
	/* Payment Type */
	public static final String PAYMENT_TYPE_CREDIT_CARD = "9";
	public static final String PAYMENT_TYPE_CREDIT_BALANCE = "R";
	
	/* Applicant Type */
	public static final String APPLICANT_TYPE_INDIVIDUAL ="individual";
	public static final String APPLICANT_TYPE_CORPORATE ="corporate";
	
	/* HTTP CLIENT */
	public static final String CONTENT_TYPE = "application/json";
//	public static final String URL_AUTO_RECOVERY_MAIL = "/notifications/email/epay_report";
	public static final String URL_AUTO_RECOVERY_MAIL = "/integrations/px/email/epay_report";
	public static final String URL_PRESUBMIT_QUOTATION = "/quotations/{0}/{1}/{2}/{3}/policy-submission";
	public static final String URL_VEHICLE_NCD_QUOTATION = "/quotations/{0}/{1}/vehicle-ncd?doctype=CCN";
	public static final String URL_MOTOR_POLICY_SUBMISSION = "/quotations/{0}/{1}/{2}/motorSubmission";
	public static final String URL_TRIGGER_PX_SEND_MAIL = "/quotations/PMOT/VPC/coverNote/certificate";
	
	/* REPORT */
	public static final String PAYMENT_REPORT_FILE_NAME = "EPAY_REPORT_";
	public static final String PAYMENT_REPORT_FILE_NAME_DATE_FORMAT = "ddMMyyyyHHmmsss";
	public static final String PAYMENT_REPORT_FILE_FIELD_DATE_FORMAT = "dd/MM/yyyy hh:mm:ss:SSS a";
	public static final String PAYMENT_REPORT_SN ="S/N";
	public static final String PAYMENT_REPORT_PRODUCT_CODE ="Product Code";
	public static final String PAYMENT_REPORT_PROPOSER_NAME ="Proposer Name";
	public static final String PAYMENT_REPORT_NRIC_FIN_PASSPORT ="NRIC/FIN/Passport";
	public static final String PAYMENT_REPORT_BUSINESS_REGISTRATION_NUMBER ="Business Registration Number";
	public static final String PAYMENT_REPORT_QUOTATION_ID ="Quotation ID";
	public static final String PAYMENT_REPORT_POLICY_NUMBER ="Policy Number";
	public static final String PAYMENT_REPORT_POLICY_ISSUANCE_DATE_TIME_STAMP ="Policy Issuance Date Time Stamp";
	public static final String PAYMENT_REPORT_PREMIUM_AMOUNT ="Premium Amount";
	public static final String PAYMENT_REPORT_EPAY_PAYMENT_REFERENCE ="EPAY Payment Reference";
	public static final String PAYMENT_REPORT_EPAY_PAYMENT_STATUS ="EPAY Payment Status";
	public static final String PAYMENT_REPORT_EPAY_PAYMENT_DATE_TIME_STAMP ="EPAY Payment Date Time Stamp";
	public static final String PAYMENT_REPORT_QUOTATION_CREATE_DATE_TIME_STAMP ="Quotation Create Date Time Stamp";
	public static final String PAYMENT_REPORT_IFE_PAYMENT_STATUS ="IFE Payment Status";
	public static final String PAYMENT_REPORT_STATUS_SUCC = "PAYMENT_COMPLETED";
	public static final String PAYMENT_REPORT_STATUS_FAIL = "PAYMENT_OTHERS";
	public static final String PAYMENT_REPORT_RECOVERED_DATE_TIME_STAMP ="Recovered Date Time Stamp";
	public static final String PAYMENT_REPORT_RECOVERED_STATUS ="Recovered Status";
	public static final ArrayList<String> PAYMENT_REPORT_COMPLETED = new ArrayList<>(Arrays.asList("PAYMENT_COMPLETED", "4", "04", "16"));
	
	/* Quotation Product Code */
	public static final String PRODUCT_CLASS_PMOT_CODE = "PMOT";
	public static final String PRODUCT_CLASS_TRAV_CODE = "TRAV";
	public static final String PRODUCT_CLASS_PA_CODE = "PA";
	
	/* CoverNote Constants */
	/* JPJ SCENARIOS */
	public static final String JPJ_OK_CODE = "JPJ_OK";
	public static final String JPJ_OK_DESC = "JPJ OK";
	public static final String JPJ_PENDING_CODE = "JPJ_PENDING";
	public static final String JPJ_PENDING_DESC = "JPJ Pending";
	public static final String JPJ_REJECTED_CODE = "JPJ_REJECTED";
	public static final String JPJ_REJECTED_DESC = "JPJ Rejected";
	public static final String JPJ_ACCEPTED_CODE = "JPJ_ACCEPTED";
	public static final String JPJ_ACCEPTED_DESC = "JPJ Accepted";
	public static final String JPJ_RESUBMISSION_CODE = "JPJ_RESUBMISSION";
	public static final String JPJ_RESUBMISSION_DESC = "JPJ Resubmission";
	
	/* JPJ Status */
	public static final String JPJ_STATUS_NO_RESPONSE_CODE = "00";
	public static final String JPJ_STATUS_NO_RESPONSE_DESC = "No response - Cover Note pending";
	public static final String JPJ_STATUS_ACCEPTED_CODE = "01";
	public static final String JPJ_STATUS_ACCEPTED_DESC = "Cover Note accepted by JPJ";
	public static final String JPJ_STATUS_REJECTED_CODE = "02";
	public static final String JPJ_STATUS_REJECTED_DESC = "Cover Note rejected by JPJ";
	
	/* JPJ DocTypes */
	public static final String JPJ_DOCTYPE_BLANK = "";
	public static final String JPJ_DOCTYPE_NEW_COVERNOTE_CODE = "0";
	public static final String JPJ_DOCTYPE_NEW_COVERNOTE_DESC = "New Cover Note case";
	public static final String JPJ_DOCTYPE_UPDATE_EXISTING_REC_CODE = "2";
	public static final String JPJ_DOCTYPE_UPDATE_EXISTING_REC_DESC = "Update existing records";
	public static final String JPJ_DOCTYPE_CANCEL_CASES_CODE = "3";
	public static final String JPJ_DOCTYPE_CANCEL_CASES_DESC = "Cancel Cases";
	public static final String JPJ_DOCTYPE_LESEN_CODE = "5";
	public static final String JPJ_DOCTYPE_LESEN_DESC = "Lesen perubahan sementara (Excursion)";
	public static final String JPJ_DOCTYPE_LICENSE_CODE = "6";
	public static final String JPJ_DOCTYPE_LICENSE_DESC = "Motor Trade License";
	public static final String JPJ_DOCTYPE_INTER_CIRCU_PERMIT_CODE = "7";
	public static final String JPJ_DOCTYPE_INTER_CIRCU_PERMIT_DESC = "International Circulation Permit";
	public static final String JPJ_DOCTYPE_FOREIGN_COM_LICENSE_CODE = "8";
	public static final String JPJ_DOCTYPE_FOREIGN_COM_LICENSE_DESC = "Foreign Commericial Vehicle License";
	
	/* JPJ Reason Code */
	public static final String JPJ_REASON_BLANK = "";
	// for DocType '0' (NEW)
	public static final String JPJ_REASON_NEW_CAR_REGIS_CODE = "0";
	public static final String JPJ_REASON_NEW_CAR_REGIS_DESC = "New Car Registration";
	public static final String JPJ_REASON_NEW_BUSINESS_FOR_REGIS_CAR_CODE = "1";
	public static final String JPJ_REASON_NEW_BUSINESS_FOR_REGIS_CAR_DESC = "New Business / Renewal for Registered Car";
	public static final String JPJ_REASON_CHANGE_ENGINE_CODE = "2";
	public static final String JPJ_REASON_CHANGE_ENGINE_DESC = "Change of Engine";
	public static final String JPJ_REASON_TRANSFER_OWNER_CODE = "3";
	public static final String JPJ_REASON_TRANSFER_OWNER_DESC = "Transfer Ownership";
	public static final String JPJ_REASON_TOTAL_LOSS_VEHI_CODE = "4";
	public static final String JPJ_REASON_TOTAL_LOSS_VEHI_DESC = "Total loss of Vehicle";
	public static final String JPJ_REASON_REPLACE_USED_INSUR_CODE = "5";
	public static final String JPJ_REASON_REPLACE_USED_INSUR_DESC = "Replacement of Used Insurance";
	// for DocType '2' (UPD)
	public static final String JPJ_REASON_EXTENSION_POLICY_CODE = "0";
	public static final String JPJ_REASON_EXTENSION_POLICY_DESC = "Extension of Policy";
	public static final String JPJ_REASON_REINSTATE_POLICY_CODE = "1";
	public static final String JPJ_REASON_REINSTATE_POLICY_DESC = "Reinstatement of Policy";
	public static final String JPJ_REASON_INTERCHANGE_CODE = "2";
	public static final String JPJ_REASON_INTERCHANGE_DESC = "Interchange (Update Veh Reg No)";
	public static final String JPJ_REASON_UPDATE_IDNO_CODE = "3";
	public static final String JPJ_REASON_UPDATE_IDNO_DESC = "Update IDNO / IDNO2";
	// for DocType '3' (CAN)
	public static final String JPJ_REASON_CANCEL_EXISTING_REC_CODE = "0";
	public static final String JPJ_REASON_CANCEL_EXISTING_REC_DESC = "Cancel Existing record";
	// for DocType '5' (LPS)
	public static final String JPJ_REASON_NEW_REC_CODE = "0";
	public static final String JPJ_REASON_NEW_REC_DESC = "New record";
	// for DocType '6' (MTL)
	public static final String JPJ_REASON_NEW_LICENSE_CODE = "0";
	public static final String JPJ_REASON_NEW_LICENSE_DESC = "New License (Open Date)";
	public static final String JPJ_REASON_RENEWAL_CODE = "1";
	public static final String JPJ_REASON_RENEWAL_DESC = "Renewal";
	// for DocType '7' (ICp) & DocType '8' (FCVL) use the same REASON_CODE with DocType '5'
	
	/* for generate Response Cases List */
	public static final String JPJ_RES_CASE = "responseCase";
	public static final String JPJ_LS_ACTIONS = "actions";
	public static final String JPJ_STATUS_RES_FIELD = "jpjStatus";
	public static final String JPJ_DOCTYPE_RES_FIELD = "documentType";
	public static final String JPJ_REASON_RES_FIELD = "reasonCode";
	public static final String JPJ_VEHICLE_RES_FIELD = "vehicleNumber";
	public static final String JPJ_HAS_VEHICLE_RES_FIELD = "hasVehicleNumber";
	
	public static final String JPJ_REQ_FIELD = "jpjDocNumber";
	public static final String JPJ_REP_RESULT = "results";
	public static final String JPJ_REP_FIELD_CVNTNUMBER = "coverNoteNumber";
	public static final String JPJ_REP_FIELD_CVNTCREATEDDATE = "coverNoteCreateDate";
	public static final String JPJ_REP_FIELD_CVNTSTARTDATE = "coverStartDate";
	public static final String JPJ_REP_FIELD_CVNTENDDATE = "coverEndDate";
	public static final String JPJ_REP_FIELD_JPJSTATUS = "jpjStatus";
	public static final String JPJ_REP_FIELD_VEHICLENUMBER = "vehicleNumber";
	public static final String JPJ_REP_FIELD_DOCTYPE = "documentType";
	public static final String JPJ_REP_FIELD_READSONCODE = "reasonCode";
	public static final String JPJ_REP_FIELD_REMARKS = "remarks";
	
	/* JPJ Actions */
	public static final String JPJ_CALL_ISM_NCD = "01";
	public static final String JPJ_UPDATE_JPJ_STATUS_REJECTED = "02";
	public static final String JPJ_UPDATE_JPJ_STATUS_ACCEPTED = "03";
	public static final String JPJ_UPDATE_QUOTATION_STATUS_REJECTED = "04";
	public static final String JPJ_CALL_POLICY_ISSUED = "05";
	public static final String JPJ_TRIGGER_PX_SEND_MAIL = "06";
	public static final String JPJ_UPDATE_QUOTATION_DATA = "07";
	
	/* End CoverNote Constants */
}
