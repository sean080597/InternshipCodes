
package com.xyz.cardcore.issuing.card.data.entity;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import jakarta.persistence.Temporal;
import jakarta.persistence.TemporalType;

@Entity
@Table(name = "TBL_CARDCORE_CARD_MASTER")
public class CardMasterEntity implements java.io.Serializable
{

    private static final long serialVersionUID = 1L;

    private String id; // ID
    private String cardNumber; // KTKRTN
    private String maskCardNumber; // mask card number
    private String productId; // KTRKID
    private String accountNumber; // KTKNTN
    private String serviceProgrammeId; // KTSVID
    private String serviceProgrammeLevel; // KTSPLV
    private String cardProgramme; // KTCPGM
    private String customerNumber; // KTKIPN
    private String applicationNumber; // KTLOPN
    private String embossingName; // KTEMNM
    private String embossingName2; // KTEMN1
    private LocalDate embossingDate; // KTEMDT
    private String cardValidThrough; // KTGTDT
    private String previousValidThrough; // KTGTDP
    private String replCardUsedYn; // KTGTST
    private String stopCode; // KTSPKD
    private String cardStatus; // KTKRST
    private LocalDate statusChangeDate; // KTSPDT
    private String cardTypePlastictipping; // KTKTTP
    private String userId; // KTUSER
    private String serviceCode; // KTSRVC
    private String numberOfCardVerifications; // KTAKFR
    private String watermark; // KTWAMK
    private Integer noOfTransPostedday; // KTNTRD
    private Integer noOfTransPostedperiod; // KTNTRC
    private Integer noOfAuthorisationAttemp; // KTAATT
    private String cardCollectionMethod; // KTCLEC
    private String cardCollectionBank; // KTCLEB
    private String cardCollectionBranch; // KTCLCB
    private String chargesIndicator; // KTCHR1
    private String ficheReference; // KTREF
    private String pinRequiredYn; // KTPINR
    private String renewalStatus; // KTRNST
    private String renewalRejectReasonCode; // KTRRJC
    private LocalDate renewalStsChgDate; // KTRWDT
    private LocalDate cardAcknowledgementDate; // KTAKDT
    private LocalDate cardActivationDueDate; // KTCADD
    private LocalDate cardStopDueDate; // KTCSDD
    private String reembossedReasonCode; // KTREMC
    private LocalDate lastEmbossedDate; // KTLEMD
    private BigDecimal creditLimit; // KTBKRD
    private LocalDate cardCollectionDate; // KTCLDT
    private LocalDate trialPeriodExpiryDate; // KTTPDT
    private BigDecimal totalPaymentsSinceCutoff; // KTAINB
    private LocalDate firstUsageDate; // KTFUDT
    private String applicationOrigin; // KTOTYP
    private String cardVerificationValue2; // KTCVV2
    private String extraCardChrgInd; // KTECHG
    private String cardGenerationRules; // KTCGEN
    private String pinDeliveryMethod; // pin delivery method
    private LocalDate annualChargeDate; // KTADAT
    private String waiveCode; // KTWACD
    private String noOfYearsToWaiveAnnual; // KTAAY
    private String currentMagneprintData; // KTCMPD
    private String previouMagneprintData; // KTPMPD
    private String veCardScheme; // KTVECS
    private String chipCardIndicator; // KTICCI
    private LocalDate lastEmbossedDate2; // KTLEBD
    private LocalDate iccFirstUsageDate; // KTICFD
    private String activationFlag; // KTDEAC
    private LocalDate activationChangeDate; // KTDEDT
    private String activationChannel; // KTDECH
    private String numberOfCardGenerated; // KTNCGN
    private String branchNumber; // KTBR
    private String photoYn; // KTPHTO
    private String cardSequenceNumber; // KTCSQN
    private String cardEvent; // KTCEVT
    private String module; // KTMODL
    private String activationTime; // KTDETM
    private String contactless; // KTCLES
    private String applicationType; // KTATP1
    private String notificationAlertContactNo;
    private String cardLink;
    private String cashWithDrawalAccount;
    private String alternateOptionForInsufficientFund;
    private LocalDateTime dateAndTime; // KTDTTM
    private String stampDutyAbsorbParty; //stame duty absorb party
    private String statusCode; // status code
    private String createdBy; // created by
    private LocalDateTime createdDatetime; // created datetime
    private String createdDomain; // created domain
    private String updatedBy; // updated by
    private LocalDateTime updatedDatetime; // updated datetime
    private String updatedDomain; // updated domain
    private String virtualActivationFlag; // virtual activation flag
    private LocalDateTime virtualActivationChangeDate; // virtual activation changeDate
    private String virtualActivationTime; // virtual activation time
    private String virtualActivationChannel; // virtual activation channel
    private String virtualActivatedBy; // virtual activated by
    private LocalDate firstTimeActivationDatetime; // first time activation time
    private LocalDateTime serviceCodeDynamicCvvExpiryDatetime; // service code dynamic cvv expiry datetime
    private String serviceCodeDynamicCvvSupport; // service code dynamic cvv support
    private String serviceCodeDynamicCvv; // service code dynamic cvv
    private String vipProductIndicator;
    private String entity;
    private String networkId;
    private String latestStopReason;
    private String activatedCardSequenceNumber;
    
    /**
     * ID
     */

    @Id
    @Column(name = "ID", nullable = false, length = 30)
    public String getId()
    {
        return this.id;
    }

    /**
     * ID
     */
    public void setId(String id)
    {
        this.id = id;
    }

    /**
     * KTKRTN
     */

    @Column(name = "CARD_NUMBER", nullable = true, length = 19)
    public String getCardNumber()
    {
        return this.cardNumber;
    }

    /**
     * KTKRTN
     */
    public void setCardNumber(String cardNumber)
    {
        this.cardNumber = cardNumber;
    }

    /**
     * mask card number
     */

    @Column(name = "MASK_CARD_NUMBER", nullable = true, length = 19)
    public String getMaskCardNumber()
    {
        return this.maskCardNumber;
    }

    /**
     * mask card number
     */
    public void setMaskCardNumber(String maskCardNumber)
    {
        this.maskCardNumber = maskCardNumber;
    }

    /**
     * KTRKID
     */

    @Column(name = "PRODUCT_ID", nullable = true, length = 50)
    public String getProductId()
    {
        return this.productId;
    }

    /**
     * KTRKID
     */
    public void setProductId(String productId)
    {
        this.productId = productId;
    }

    /**
     * KTKNTN
     */

    @Column(name = "ACCOUNT_NUMBER", nullable = true, length = 19)
    public String getAccountNumber()
    {
        return this.accountNumber;
    }

    /**
     * KTKNTN
     */
    public void setAccountNumber(String accountNumber)
    {
        this.accountNumber = accountNumber;
    }

    /**
     * KTSVID
     */

    @Column(name = "SERVICE_PROGRAMME_ID", nullable = true, length = 6)
    public String getServiceProgrammeId()
    {
        return this.serviceProgrammeId;
    }

    /**
     * KTSVID
     */
    public void setServiceProgrammeId(String serviceProgrammeId)
    {
        this.serviceProgrammeId = serviceProgrammeId;
    }

    /**
     * KTSPLV
     */

    @Column(name = "SERVICE_PROGRAMME_LEVEL", nullable = true, length = 3)
    public String getServiceProgrammeLevel()
    {
        return this.serviceProgrammeLevel;
    }

    /**
     * KTSPLV
     */
    public void setServiceProgrammeLevel(String serviceProgrammeLevel)
    {
        this.serviceProgrammeLevel = serviceProgrammeLevel;
    }

    /**
     * KTCPGM
     */

    @Column(name = "CARD_PROGRAMME", nullable = true, length = 3)
    public String getCardProgramme()
    {
        return this.cardProgramme;
    }

    /**
     * KTCPGM
     */
    public void setCardProgramme(String cardProgramme)
    {
        this.cardProgramme = cardProgramme;
    }

    /**
     * KTKIPN
     */

    @Column(name = "CUSTOMER_NUMBER", nullable = true, length = 19)
    public String getCustomerNumber()
    {
        return this.customerNumber;
    }

    /**
     * KTKIPN
     */
    public void setCustomerNumber(String customerNumber)
    {
        this.customerNumber = customerNumber;
    }

    /**
     * KTLOPN
     */

    @Column(name = "APPLICATION_NUMBER", nullable = true, length = 30)
    public String getApplicationNumber()
    {
        return this.applicationNumber;
    }

    /**
     * KTLOPN
     */
    public void setApplicationNumber(String applicationNumber)
    {
        this.applicationNumber = applicationNumber;
    }

    /**
     * KTEMNM
     */

    @Column(name = "EMBOSSING_NAME", nullable = true, length = 200)
    public String getEmbossingName()
    {
        return this.embossingName;
    }

    /**
     * KTEMNM
     */
    public void setEmbossingName(String embossingName)
    {
        this.embossingName = embossingName;
    }

    /**
     * KTEMN1
     */

    @Column(name = "EMBOSSING_NAME_2", nullable = true, length = 200)
    public String getEmbossingName2()
    {
        return this.embossingName2;
    }

    /**
     * KTEMN1
     */
    public void setEmbossingName2(String embossingName2)
    {
        this.embossingName2 = embossingName2;
    }

    /**
     * KTEMDT
     */

//    @Temporal(TemporalType.TIMESTAMP)
    @Column(name = "EMBOSSING_DATE", length = 26)
    public LocalDate getEmbossingDate()
    {
        return this.embossingDate;
    }

    /**
     * KTEMDT
     */
    public void setEmbossingDate(LocalDate embossingDate)
    {
        this.embossingDate = embossingDate;
    }

    /**
     * KTGTDT
     */

    @Column(name = "CARD_VALID_THROUGH", nullable = true, length = 6)
    public String getCardValidThrough()
    {
        return this.cardValidThrough;
    }

    /**
     * KTGTDT
     */
    public void setCardValidThrough(String cardValidThrough)
    {
        this.cardValidThrough = cardValidThrough;
    }

    /**
     * KTGTDP
     */

    @Column(name = "PREVIOUS_VALID_THROUGH", nullable = true, length = 6)
    public String getPreviousValidThrough()
    {
        return this.previousValidThrough;
    }

    /**
     * KTGTDP
     */
    public void setPreviousValidThrough(String previousValidThrough)
    {
        this.previousValidThrough = previousValidThrough;
    }

    /**
     * KTGTST
     */

    @Column(name = "REPL_CARD_USED_YN", nullable = true, length = 1)
    public String getReplCardUsedYn()
    {
        return this.replCardUsedYn;
    }

    /**
     * KTGTST
     */
    public void setReplCardUsedYn(String replCardUsedYn)
    {
        this.replCardUsedYn = replCardUsedYn;
    }

    /**
     * KTSPKD
     */

    @Column(name = "STOP_CODE", nullable = true, length = 1)
    public String getStopCode()
    {
        return this.stopCode;
    }

    /**
     * KTSPKD
     */
    public void setStopCode(String stopCode)
    {
        this.stopCode = stopCode;
    }

    /**
     * KTKRST
     */

    @Column(name = "CARD_STATUS", nullable = true, length = 3)
    public String getCardStatus()
    {
        return this.cardStatus;
    }

    /**
     * KTKRST
     */
    public void setCardStatus(String cardStatus)
    {
        this.cardStatus = cardStatus;
    }

    /**
     * KTSPDT
     */

//    @Temporal(TemporalType.TIMESTAMP)
    @Column(name = "STATUS_CHANGE_DATE", length = 26)
    public LocalDate getStatusChangeDate()
    {
        return this.statusChangeDate;
    }

    /**
     * KTSPDT
     */
    public void setStatusChangeDate(LocalDate statusChangeDate)
    {
        this.statusChangeDate = statusChangeDate;
    }

    /**
     * KTKTTP
     */

    @Column(name = "CARD_TYPE_PLASTICTIPPING", nullable = true, length = 3)
    public String getCardTypePlastictipping()
    {
        return this.cardTypePlastictipping;
    }

    /**
     * KTKTTP
     */
    public void setCardTypePlastictipping(String cardTypePlastictipping)
    {
        this.cardTypePlastictipping = cardTypePlastictipping;
    }

    /**
     * KTUSER
     */

    @Column(name = "USER_ID", nullable = true, length = 10)
    public String getUserId()
    {
        return this.userId;
    }

    /**
     * KTUSER
     */
    public void setUserId(String userId)
    {
        this.userId = userId;
    }

    /**
     * KTSRVC
     */

    @Column(name = "SERVICE_CODE", nullable = true, length = 3)
    public String getServiceCode()
    {
        return this.serviceCode;
    }

    /**
     * KTSRVC
     */
    public void setServiceCode(String serviceCode)
    {
        this.serviceCode = serviceCode;
    }

    /**
     * KTAKFR
     */

    @Column(name = "NUMBER_OF_CARD_VERIFICATIONS", nullable = true, length = 3)
    public String getNumberOfCardVerifications()
    {
        return this.numberOfCardVerifications;
    }

    /**
     * KTAKFR
     */
    public void setNumberOfCardVerifications(String numberOfCardVerifications)
    {
        this.numberOfCardVerifications = numberOfCardVerifications;
    }

    /**
     * KTWAMK
     */

    @Column(name = "WATERMARK", nullable = true, length = 13)
    public String getWatermark()
    {
        return this.watermark;
    }

    /**
     * KTWAMK
     */
    public void setWatermark(String watermark)
    {
        this.watermark = watermark;
    }

    /**
     * KTNTRD
     */

    @Column(name = "NO_OF_TRANS_POSTEDDAY", nullable = true, length = 3)
    public Integer getNoOfTransPostedday()
    {
        return this.noOfTransPostedday;
    }

    /**
     * KTNTRD
     */
    public void setNoOfTransPostedday(Integer noOfTransPostedday)
    {
        this.noOfTransPostedday = noOfTransPostedday;
    }

    /**
     * KTNTRC
     */

    @Column(name = "NO_OF_TRANS_POSTEDPERIOD", nullable = true, length = 3)
    public Integer getNoOfTransPostedperiod()
    {
        return this.noOfTransPostedperiod;
    }

    /**
     * KTNTRC
     */
    public void setNoOfTransPostedperiod(Integer noOfTransPostedperiod)
    {
        this.noOfTransPostedperiod = noOfTransPostedperiod;
    }

    /**
     * KTAATT
     */

    @Column(name = "NO_OF_AUTHORISATION_ATTEMP", nullable = true, length = 3)
    public Integer getNoOfAuthorisationAttemp()
    {
        return this.noOfAuthorisationAttemp;
    }

    /**
     * KTAATT
     */
    public void setNoOfAuthorisationAttemp(Integer noOfAuthorisationAttemp)
    {
        this.noOfAuthorisationAttemp = noOfAuthorisationAttemp;
    }

    /**
     * KTCLEC
     */

    @Column(name = "CARD_COLLECTION_METHOD", nullable = true, length = 6)
    public String getCardCollectionMethod()
    {
        return this.cardCollectionMethod;
    }

    /**
     * KTCLEC
     */
    public void setCardCollectionMethod(String cardCollectionMethod)
    {
        this.cardCollectionMethod = cardCollectionMethod;
    }

    /**
     * KTCLEB
     */

    @Column(name = "CARD_COLLECTION_BANK", nullable = true, length = 2)
    public String getCardCollectionBank()
    {
        return this.cardCollectionBank;
    }

    /**
     * KTCLEB
     */
    public void setCardCollectionBank(String cardCollectionBank)
    {
        this.cardCollectionBank = cardCollectionBank;
    }

    /**
     * KTCLCB
     */

    @Column(name = "CARD_COLLECTION_BRANCH", nullable = true, length = 6)
    public String getCardCollectionBranch()
    {
        return this.cardCollectionBranch;
    }

    /**
     * KTCLCB
     */
    public void setCardCollectionBranch(String cardCollectionBranch)
    {
        this.cardCollectionBranch = cardCollectionBranch;
    }

    /**
     * KTCHR1
     */

    @Column(name = "CHARGES_INDICATOR", nullable = true, length = 1)
    public String getChargesIndicator()
    {
        return this.chargesIndicator;
    }

    /**
     * KTCHR1
     */
    public void setChargesIndicator(String chargesIndicator)
    {
        this.chargesIndicator = chargesIndicator;
    }

    /**
     * KTREF
     */

    @Column(name = "FICHE_REFERENCE", nullable = true, length = 15)
    public String getFicheReference()
    {
        return this.ficheReference;
    }

    /**
     * KTREF
     */
    public void setFicheReference(String ficheReference)
    {
        this.ficheReference = ficheReference;
    }

    /**
     * KTPINR
     */

    @Column(name = "PIN_REQUIRED_YN", nullable = true, length = 6)
    public String getPinRequiredYn()
    {
        return this.pinRequiredYn;
    }

    /**
     * KTPINR
     */
    public void setPinRequiredYn(String pinRequiredYn)
    {
        this.pinRequiredYn = pinRequiredYn;
    }

    /**
     * KTRNST
     */

    @Column(name = "RENEWAL_STATUS", nullable = true, length = 3)
    public String getRenewalStatus()
    {
        return this.renewalStatus;
    }

    /**
     * KTRNST
     */
    public void setRenewalStatus(String renewalStatus)
    {
        this.renewalStatus = renewalStatus;
    }

    /**
     * KTRRJC
     */

    @Column(name = "RENEWAL_REJECT_REASON_CODE", nullable = true, length = 3)
    public String getRenewalRejectReasonCode()
    {
        return this.renewalRejectReasonCode;
    }

    /**
     * KTRRJC
     */
    public void setRenewalRejectReasonCode(String renewalRejectReasonCode)
    {
        this.renewalRejectReasonCode = renewalRejectReasonCode;
    }

    /**
     * KTRWDT
     */

//    @Temporal(TemporalType.TIMESTAMP)
    @Column(name = "RENEWAL_STS_CHG_DATE", length = 26)
    public LocalDate getRenewalStsChgDate()
    {
        return this.renewalStsChgDate;
    }

    /**
     * KTRWDT
     */
    public void setRenewalStsChgDate(LocalDate renewalStsChgDate)
    {
        this.renewalStsChgDate = renewalStsChgDate;
    }

    /**
     * KTAKDT
     */

//    @Temporal(TemporalType.TIMESTAMP)
    @Column(name = "CARD_ACKNOWLEDGEMENT_DATE", length = 26)
    public LocalDate getCardAcknowledgementDate()
    {
        return this.cardAcknowledgementDate;
    }

    /**
     * KTAKDT
     */
    public void setCardAcknowledgementDate(LocalDate cardAcknowledgementDate)
    {
        this.cardAcknowledgementDate = cardAcknowledgementDate;
    }

    /**
     * KTCADD
     */

//    @Temporal(TemporalType.TIMESTAMP)
    @Column(name = "CARD_ACTIVATION_DUE_DATE", length = 26)
    public LocalDate getCardActivationDueDate()
    {
        return this.cardActivationDueDate;
    }

    /**
     * KTCADD
     */
    public void setCardActivationDueDate(LocalDate cardActivationDueDate)
    {
        this.cardActivationDueDate = cardActivationDueDate;
    }

    /**
     * KTCSDD
     */

//    @Temporal(TemporalType.TIMESTAMP)
    @Column(name = "CARD_STOP_DUE_DATE", length = 26)
    public LocalDate getCardStopDueDate()
    {
        return this.cardStopDueDate;
    }

    /**
     * KTCSDD
     */
    public void setCardStopDueDate(LocalDate cardStopDueDate)
    {
        this.cardStopDueDate = cardStopDueDate;
    }

    /**
     * KTREMC
     */

    @Column(name = "REEMBOSSED_REASON_CODE", nullable = true, length = 2)
    public String getReembossedReasonCode()
    {
        return this.reembossedReasonCode;
    }

    /**
     * KTREMC
     */
    public void setReembossedReasonCode(String reembossedReasonCode)
    {
        this.reembossedReasonCode = reembossedReasonCode;
    }

    /**
     * KTLEMD
     */

//    @Temporal(TemporalType.TIMESTAMP)
    @Column(name = "LAST_EMBOSSED_DATE", length = 26)
    public LocalDate getLastEmbossedDate()
    {
        return this.lastEmbossedDate;
    }

    /**
     * KTLEMD
     */
    public void setLastEmbossedDate(LocalDate lastEmbossedDate)
    {
        this.lastEmbossedDate = lastEmbossedDate;
    }

    /**
     * KTBKRD
     */

    @Column(name = "CREDIT_LIMIT", precision = 20, scale = 3)
    public BigDecimal getCreditLimit()
    {
        return this.creditLimit;
    }

    /**
     * KTBKRD
     */
    public void setCreditLimit(BigDecimal creditLimit)
    {
        this.creditLimit = creditLimit;
    }

    /**
     * KTCLDT
     */

//    @Temporal(TemporalType.TIMESTAMP)
    @Column(name = "CARD_COLLECTION_DATE", length = 26)
    public LocalDate getCardCollectionDate()
    {
        return this.cardCollectionDate;
    }

    /**
     * KTCLDT
     */
    public void setCardCollectionDate(LocalDate cardCollectionDate)
    {
        this.cardCollectionDate = cardCollectionDate;
    }

    /**
     * KTTPDT
     */

//    @Temporal(TemporalType.TIMESTAMP)
    @Column(name = "TRIAL_PERIOD_EXPIRY_DATE", length = 26)
    public LocalDate getTrialPeriodExpiryDate()
    {
        return this.trialPeriodExpiryDate;
    }

    /**
     * KTTPDT
     */
    public void setTrialPeriodExpiryDate(LocalDate trialPeriodExpiryDate)
    {
        this.trialPeriodExpiryDate = trialPeriodExpiryDate;
    }

    /**
     * KTAINB
     */

    @Column(name = "TOTAL_PAYMENTS_SINCE_CUTOFF", precision = 20, scale = 3)
    public BigDecimal getTotalPaymentsSinceCutoff()
    {
        return this.totalPaymentsSinceCutoff;
    }

    /**
     * KTAINB
     */
    public void setTotalPaymentsSinceCutoff(BigDecimal totalPaymentsSinceCutoff)
    {
        this.totalPaymentsSinceCutoff = totalPaymentsSinceCutoff;
    }

    /**
     * KTFUDT
     */

//    @Temporal(TemporalType.TIMESTAMP)
    @Column(name = "FIRST_USAGE_DATE", length = 26)
    public LocalDate getFirstUsageDate()
    {
        return this.firstUsageDate;
    }

    /**
     * KTFUDT
     */
    public void setFirstUsageDate(LocalDate firstUsageDate)
    {
        this.firstUsageDate = firstUsageDate;
    }

    /**
     * KTOTYP
     */

    @Column(name = "APPLICATION_ORIGIN", nullable = true, length = 6)
    public String getApplicationOrigin()
    {
        return this.applicationOrigin;
    }

    /**
     * KTOTYP
     */
    public void setApplicationOrigin(String applicationOrigin)
    {
        this.applicationOrigin = applicationOrigin;
    }

    /**
     * KTCVV2
     */

    @Column(name = "CARD_VERIFICATION_VALUE_2", nullable = true, length = 3)
    public String getCardVerificationValue2()
    {
        return this.cardVerificationValue2;
    }

    /**
     * KTCVV2
     */
    public void setCardVerificationValue2(String cardVerificationValue2)
    {
        this.cardVerificationValue2 = cardVerificationValue2;
    }

    /**
     * KTECHG
     */

    @Column(name = "EXTRA_CARD_CHRG_IND", nullable = true, length = 1)
    public String getExtraCardChrgInd()
    {
        return this.extraCardChrgInd;
    }

    /**
     * KTECHG
     */
    public void setExtraCardChrgInd(String extraCardChrgInd)
    {
        this.extraCardChrgInd = extraCardChrgInd;
    }

    /**
     * KTCGEN
     */

    @Column(name = "CARD_GENERATION_RULES", nullable = true, length = 6)
    public String getCardGenerationRules()
    {
        return this.cardGenerationRules;
    }

    /**
     * KTCGEN
     */
    public void setCardGenerationRules(String cardGenerationRules)
    {
        this.cardGenerationRules = cardGenerationRules;
    }

    /**
     * pin delivery method
     */

    @Column(name = "PIN_DELIVERY_METHOD", nullable = true, length = 100)
    public String getPinDeliveryMethod()
    {
        return this.pinDeliveryMethod;
    }

    /**
     * pin delivery method
     */
    public void setPinDeliveryMethod(String pinDeliveryMethod)
    {
        this.pinDeliveryMethod = pinDeliveryMethod;
    }

    /**
     * KTADAT
     */

//    @Temporal(TemporalType.TIMESTAMP)
    @Column(name = "ANNUAL_CHARGE_DATE", length = 26)
    public LocalDate getAnnualChargeDate()
    {
        return this.annualChargeDate;
    }

    /**
     * KTADAT
     */
    public void setAnnualChargeDate(LocalDate annualChargeDate)
    {
        this.annualChargeDate = annualChargeDate;
    }

    /**
     * KTWACD
     */

    @Column(name = "WAIVE_CODE", nullable = true, length = 1)
    public String getWaiveCode()
    {
        return this.waiveCode;
    }

    /**
     * KTWACD
     */
    public void setWaiveCode(String waiveCode)
    {
        this.waiveCode = waiveCode;
    }

    /**
     * KTAAY
     */

    @Column(name = "NO_OF_YEARS_TO_WAIVE_ANNUAL", nullable = true, length = 3)
    public String getNoOfYearsToWaiveAnnual()
    {
        return this.noOfYearsToWaiveAnnual;
    }

    /**
     * KTAAY
     */
    public void setNoOfYearsToWaiveAnnual(String noOfYearsToWaiveAnnual)
    {
        this.noOfYearsToWaiveAnnual = noOfYearsToWaiveAnnual;
    }

    /**
     * KTCMPD
     */

    @Column(name = "CURRENT_MAGNEPRINT_DATA", nullable = true, length = 54)
    public String getCurrentMagneprintData()
    {
        return this.currentMagneprintData;
    }

    /**
     * KTCMPD
     */
    public void setCurrentMagneprintData(String currentMagneprintData)
    {
        this.currentMagneprintData = currentMagneprintData;
    }

    /**
     * KTPMPD
     */

    @Column(name = "PREVIOU__MAGNEPRINT_DATA", nullable = true, length = 54)
    public String getPreviouMagneprintData()
    {
        return this.previouMagneprintData;
    }

    /**
     * KTPMPD
     */
    public void setPreviouMagneprintData(String previouMagneprintData)
    {
        this.previouMagneprintData = previouMagneprintData;
    }

    /**
     * KTVECS
     */

    @Column(name = "VE_CARD_SCHEME", nullable = true, length = 3)
    public String getVeCardScheme()
    {
        return this.veCardScheme;
    }

    /**
     * KTVECS
     */
    public void setVeCardScheme(String veCardScheme)
    {
        this.veCardScheme = veCardScheme;
    }

    /**
     * KTICCI
     */

    @Column(name = "CHIP_CARD_INDICATOR", nullable = true, length = 1)
    public String getChipCardIndicator()
    {
        return this.chipCardIndicator;
    }

    /**
     * KTICCI
     */
    public void setChipCardIndicator(String chipCardIndicator)
    {
        this.chipCardIndicator = chipCardIndicator;
    }

    /**
     * KTLEBD
     */

//    @Temporal(TemporalType.TIMESTAMP)
    @Column(name = "LAST_EMBOSSED_DATE_2", length = 26)
    public LocalDate getLastEmbossedDate2()
    {
        return this.lastEmbossedDate2;
    }

    /**
     * KTLEBD
     */
    public void setLastEmbossedDate2(LocalDate lastEmbossedDate2)
    {
        this.lastEmbossedDate2 = lastEmbossedDate2;
    }

    /**
     * KTICFD
     */

//    @Temporal(TemporalType.TIMESTAMP)
    @Column(name = "ICC_FIRST_USAGE_DATE", length = 26)
    public LocalDate getIccFirstUsageDate()
    {
        return this.iccFirstUsageDate;
    }

    /**
     * KTICFD
     */
    public void setIccFirstUsageDate(LocalDate iccFirstUsageDate)
    {
        this.iccFirstUsageDate = iccFirstUsageDate;
    }

    /**
     * KTDEAC
     */

    @Column(name = "ACTIVATION_FLAG", nullable = true, length = 1)
    public String getActivationFlag()
    {
        return this.activationFlag;
    }

    /**
     * KTDEAC
     */
    public void setActivationFlag(String activationFlag)
    {
        this.activationFlag = activationFlag;
    }

    /**
     * KTDEDT
     */

//    @Temporal(TemporalType.TIMESTAMP)
    @Column(name = "ACTIVATION_CHANGE_DATE", length = 26)
    public LocalDate getActivationChangeDate()
    {
        return this.activationChangeDate;
    }

    /**
     * KTDEDT
     */
    public void setActivationChangeDate(LocalDate activationChangeDate)
    {
        this.activationChangeDate = activationChangeDate;
    }

    /**
     * KTDECH
     */

    @Column(name = "ACTIVATION_CHANNEL", nullable = true, length = 10)
    public String getActivationChannel()
    {
        return this.activationChannel;
    }

    /**
     * KTDECH
     */
    public void setActivationChannel(String activationChannel)
    {
        this.activationChannel = activationChannel;
    }

    /**
     * KTNCGN
     */

    @Column(name = "NUMBER_OF_CARD_GENERATED", nullable = true, length = 3)
    public String getNumberOfCardGenerated()
    {
        return this.numberOfCardGenerated;
    }

    /**
     * KTNCGN
     */
    public void setNumberOfCardGenerated(String numberOfCardGenerated)
    {
        this.numberOfCardGenerated = numberOfCardGenerated;
    }

    /**
     * KTBR
     */

    @Column(name = "BRANCH_NUMBER", nullable = true, length = 5)
    public String getBranchNumber()
    {
        return this.branchNumber;
    }

    /**
     * KTBR
     */
    public void setBranchNumber(String branchNumber)
    {
        this.branchNumber = branchNumber;
    }

    /**
     * KTPHTO
     */

    @Column(name = "PHOTO_YN", nullable = true, length = 1)
    public String getPhotoYn()
    {
        return this.photoYn;
    }

    /**
     * KTPHTO
     */
    public void setPhotoYn(String photoYn)
    {
        this.photoYn = photoYn;
    }

    /**
     * KTCSQN
     */

    @Column(name = "CARD_SEQUENCE_NUMBER", nullable = true, length = 3)
    public String getCardSequenceNumber()
    {
        return this.cardSequenceNumber;
    }

    /**
     * KTCSQN
     */
    public void setCardSequenceNumber(String cardSequenceNumber)
    {
        this.cardSequenceNumber = cardSequenceNumber;
    }

    /**
     * KTCEVT
     */

    @Column(name = "CARD_EVENT", nullable = true, length = 1)
    public String getCardEvent()
    {
        return this.cardEvent;
    }

    /**
     * KTCEVT
     */
    public void setCardEvent(String cardEvent)
    {
        this.cardEvent = cardEvent;
    }

    /**
     * KTMODL
     */

    @Column(name = "MODULE", nullable = true, length = 2)
    public String getModule()
    {
        return this.module;
    }

    /**
     * KTMODL
     */
    public void setModule(String module)
    {
        this.module = module;
    }

    /**
     * KTDETM
     */

    @Column(name = "ACTIVATION_TIME", nullable = true, length = 6)
    public String getActivationTime()
    {
        return this.activationTime;
    }

    /**
     * KTDETM
     */
    public void setActivationTime(String activationTime)
    {
        this.activationTime = activationTime;
    }

    /**
     * KTCLES
     */

    @Column(name = "CONTACTLESS", nullable = true, length = 1)
    public String getContactless()
    {
        return this.contactless;
    }

    /**
     * KTCLES
     */
    public void setContactless(String contactless)
    {
        this.contactless = contactless;
    }

    /**
     * KTATP1
     */

    @Column(name = "APPLICATION_TYPE", nullable = true, length = 1)
    public String getApplicationType()
    {
        return this.applicationType;
    }

    /**
     * KTATP1
     */
    public void setApplicationType(String applicationType)
    {
        this.applicationType = applicationType;
    }

    @Column(name = "NOTIFICATION_ALERT_CONTACT_NO", nullable = true, length = 30)
    public String getNotificationAlertContactNo()
    {
        return notificationAlertContactNo;
    }

    public void setNotificationAlertContactNo(String notificationAlertContactNo)
    {
        this.notificationAlertContactNo = notificationAlertContactNo;
    }
    
    @Column(name = "CARD_LINK", nullable = true, length = 30)
    public String getCardLink()
    {
        return cardLink;
    }

    public void setCardLink(String cardLink)
    {
        this.cardLink = cardLink;
    }   

    @Column(name = "CASH_WITHDRAWAL_ACCOUNT", nullable = true, length = 3)
    public String getCashWithDrawalAccount() {
		return cashWithDrawalAccount;
	}

	public void setCashWithDrawalAccount(String cashWithDrawalAccount) {
		this.cashWithDrawalAccount = cashWithDrawalAccount;
	}

	@Column(name = "ALTERNAL_OPTION_INSUFFICIENT_FUND", nullable = true, length = 1)
	public String getAlternateOptionForInsufficientFund() {
		return alternateOptionForInsufficientFund;
	}

	public void setAlternateOptionForInsufficientFund(String alternateOptionForInsufficientFund) {
		this.alternateOptionForInsufficientFund = alternateOptionForInsufficientFund;
	}

	/**
     * KTDTTM
     */

    @Temporal(TemporalType.TIMESTAMP)
    @Column(name = "DATE_AND_TIME", length = 26)
    public LocalDateTime getDateAndTime()
    {
        return this.dateAndTime;
    }

    
    /**
     * KTDTTM
     */
    public void setDateAndTime(LocalDateTime dateAndTime)
    {
        this.dateAndTime = dateAndTime;
    }
    
    @Column(name = "STAMP_DUTY_ABSORB_PARTY", nullable = true, length = 10)
    public String getStampDutyAbsorbParty()
    {
        return stampDutyAbsorbParty;
    }

    public void setStampDutyAbsorbParty(String stampDutyAbsorbParty)
    {
        this.stampDutyAbsorbParty = stampDutyAbsorbParty;
    }

    /**
     * status code
     */

    @Column(name = "STATUS_CODE", nullable = true, length = 50)
    public String getStatusCode()
    {
        return this.statusCode;
    }

    /**
     * status code
     */
    public void setStatusCode(String statusCode)
    {
        this.statusCode = statusCode;
    }

    /**
     * created by
     */

    @Column(name = "CREATED_BY", nullable = true, length = 100)
    public String getCreatedBy()
    {
        return this.createdBy;
    }

    /**
     * created by
     */
    public void setCreatedBy(String createdBy)
    {
        this.createdBy = createdBy;
    }

    /**
     * created datetime
     */

    @Temporal(TemporalType.TIMESTAMP)
    @Column(name = "CREATED_DATETIME", length = 26)
    public LocalDateTime getCreatedDatetime()
    {
        return this.createdDatetime;
    }

    /**
     * created datetime
     */
    public void setCreatedDatetime(LocalDateTime createdDatetime)
    {
        this.createdDatetime = createdDatetime;
    }

    /**
     * created domain
     */

    @Column(name = "CREATED_DOMAIN", nullable = true, length = 10)
    public String getCreatedDomain()
    {
        return this.createdDomain;
    }

    /**
     * created domain
     */
    public void setCreatedDomain(String createdDomain)
    {
        this.createdDomain = createdDomain;
    }

    /**
     * updated by
     */

    @Column(name = "UPDATED_BY", nullable = true, length = 100)
    public String getUpdatedBy()
    {
        return this.updatedBy;
    }

    /**
     * updated by
     */
    public void setUpdatedBy(String updatedBy)
    {
        this.updatedBy = updatedBy;
    }

    /**
     * updated datetime
     */

    @Temporal(TemporalType.TIMESTAMP)
    @Column(name = "UPDATED_DATETIME", length = 26)
    public LocalDateTime getUpdatedDatetime()
    {
        return this.updatedDatetime;
    }

    /**
     * updated datetime
     */
    public void setUpdatedDatetime(LocalDateTime updatedDatetime)
    {
        this.updatedDatetime = updatedDatetime;
    }

    /**
     * updated domain
     */

    @Column(name = "UPDATED_DOMAIN", nullable = true, length = 10)
    public String getUpdatedDomain()
    {
        return this.updatedDomain;
    }

    /**
     * updated domain
     */
    public void setUpdatedDomain(String updatedDomain)
    {
        this.updatedDomain = updatedDomain;
    }

    /**
     * virtual activation flag
     */
    @Column(name = "VIRTUAL_ACTIVATION_FLAG", nullable = true, length = 1)
	public String getVirtualActivationFlag() {
		return virtualActivationFlag;
	}

    /**
     * virtual activation flag
     */
	public void setVirtualActivationFlag(String virtualActivationFlag) {
		this.virtualActivationFlag = virtualActivationFlag;
	}

    /**
     * virtual activation change date
     */
    @Temporal(TemporalType.TIMESTAMP)
    @Column(name = "VIRTUAL_ACTIVATION_CHANGE_DATE", length = 26)
	public LocalDateTime getVirtualActivationChangeDate() {
		return virtualActivationChangeDate;
	}

    /**
     * virtual activation change date
     */
	public void setVirtualActivationChangeDate(LocalDateTime virtualActivationChangeDate) {
		this.virtualActivationChangeDate = virtualActivationChangeDate;
	}

    /**
     * virtual activation time
     */
    @Column(name = "VIRTUAL_ACTIVATION_TIME", nullable = true, length = 6)
	public String getVirtualActivationTime() {
		return virtualActivationTime;
	}

    /**
     * virtual activation time
     */
	public void setVirtualActivationTime(String virtualActivationTime) {
		this.virtualActivationTime = virtualActivationTime;
	}

    /**
     * virtual activation channel
     */
    @Column(name = "VIRTUAL_ACTIVATION_CHANNEL", nullable = true, length = 10)
	public String getVirtualActivationChannel() {
		return virtualActivationChannel;
	}

    /**
     * virtual activation channel
     */
	public void setVirtualActivationChannel(String virtualActivationChannel) {
		this.virtualActivationChannel = virtualActivationChannel;
	}

    /**
     * virtual activated by
     */
    @Column(name = "VIRTUAL_ACTIVATED_BY", nullable = true, length = 10)
	public String getVirtualActivatedBy() {
		return virtualActivatedBy;
	}

    /**
     * virtual activated by
     */
	public void setVirtualActivatedBy(String virtualActivatedBy) {
		this.virtualActivatedBy = virtualActivatedBy;
	}
    
	/**
     * first time activation datetime
     */
//	@Temporal(TemporalType.TIMESTAMP)
    @Column(name = "FIRST_TIME_ACTIVATION_DATETIME", length = 26)
    public LocalDate getFirstTimeActivationDatetime() {
        return firstTimeActivationDatetime;
    }

    /**
     * first time activation datetime
     */
    public void setFirstTimeActivationDatetime(LocalDate firstTimeActivationDatetime) {
        this.firstTimeActivationDatetime = firstTimeActivationDatetime;
    }

	/**
     * service code dynamic cvv expiry datetime
     */
	@Temporal(TemporalType.TIMESTAMP)
    @Column(name = "SERVICE_CODE_DYNAMIC_CVV_EXPIRY_DATETIME", length = 26)
	public LocalDateTime getServiceCodeDynamicCvvExpiryDatetime() {
		return serviceCodeDynamicCvvExpiryDatetime;
	}

	public void setServiceCodeDynamicCvvExpiryDatetime(LocalDateTime serviceCodeDynamicCvvExpiryDatetime) {
		this.serviceCodeDynamicCvvExpiryDatetime = serviceCodeDynamicCvvExpiryDatetime;
	}
	
	/**
     * service code dynamic cvv support
     */
	@Column(name = "SERVICE_CODE_DYNAMIC_CVV_SUPPORT", nullable = true, length = 1)
	public String getServiceCodeDynamicCvvSupport() {
		return serviceCodeDynamicCvvSupport;
	}

	public void setServiceCodeDynamicCvvSupport(String serviceCodeDynamicCvvSupport) {
		this.serviceCodeDynamicCvvSupport = serviceCodeDynamicCvvSupport;
	}

	/**
     * service code dynamic cvv
     */
	@Column(name = "SERVICE_CODE_DYNAMIC_CVV", nullable = true, length = 3)
	public String getServiceCodeDynamicCvv() {
		return serviceCodeDynamicCvv;
	}

	public void setServiceCodeDynamicCvv(String serviceCodeDynamicCvv) {
		this.serviceCodeDynamicCvv = serviceCodeDynamicCvv;
	}

	@Column(name = "VIP_PRODUCT_INDICATOR", nullable = true, length = 30)
    public String getVipProductIndicator()
    {
        return vipProductIndicator;
    }

    public void setVipProductIndicator(String vipProductIndicator)
    {
        this.vipProductIndicator = vipProductIndicator;
    }

    @Column(name = "ENTITY", nullable = true, length = 50)
    public String getEntity()
    {
        return entity;
    }

    public void setEntity(String entity)
    {
        this.entity = entity;
    }
	
    @Column(name = "NETWORK_ID", nullable = true, length = 3)
    public String getNetworkId()
    {
        return networkId;
    }

    public void setNetworkId(String networkId)
    {
        this.networkId = networkId;
    }

    @Column(name = "LATEST_STOP_REASON", nullable = true, length = 2)
	public String getLatestStopReason() 
	{
		return latestStopReason;
	}

	public void setLatestStopReason(String latestStopReason) 
	{
		this.latestStopReason = latestStopReason;
	}

    @Column(name = "ACTIVATED_CARD_SEQUENCE_NUMBER", nullable = true, length = 3)
	public String getActivatedCardSequenceNumber() 
	{
		return activatedCardSequenceNumber;
	}

	public void setActivatedCardSequenceNumber(String activatedCardSequenceNumber) 
	{
		this.activatedCardSequenceNumber = activatedCardSequenceNumber;
	}
}