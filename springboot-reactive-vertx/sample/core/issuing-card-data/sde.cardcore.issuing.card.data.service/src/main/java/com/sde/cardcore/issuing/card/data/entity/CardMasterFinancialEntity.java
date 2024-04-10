
package com.xyz.cardcore.issuing.card.data.entity;

import java.math.BigDecimal;
import java.util.Date;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.PrePersist;
import jakarta.persistence.Table;
import jakarta.persistence.Temporal;
import jakarta.persistence.TemporalType;

@Entity
@Table(name = "TBL_CARDCORE_CARD_MASTER_FINANCIAL")
public class CardMasterFinancialEntity implements java.io.Serializable
{

    private static final long serialVersionUID = 1L;

    private String id; // ID
    private String cardLink; // card link
    private String currency; // currency
    private BigDecimal creditLimit; // KTBKRD
    private Date authorisationDate; // KTAUDT
    private Integer noApprovedAuthToday; // KTNODT
    private BigDecimal amountAuthorisedToday; // KTAMDT
    private Date startDateCurrent7DayCyc; // KTSADT
    private Integer noApprovedAuth7Days; // KTNOPD
    private BigDecimal amountAuthorised7Days; // KTAMPD
    private Date latestInternatAuth; // KTIADT
    private Integer noApprIntAuthToday; // KTNIDT
    private BigDecimal amountAuthorisedTodayInt; // KTAIDT
    private Date startDateInt7DayCycle; // KTSIDT
    private Integer noApprIntAuth7Days; // KTNIPD
    private BigDecimal intAmountAuth7Days; // KTIAPD
    private BigDecimal authorisedAmount; // KTPRBO
    private BigDecimal totalTransactionAmount; // KTATRA
    private BigDecimal totalIntchargeAmount; // KTARNT
    private BigDecimal lastTransactionAmount; // KTLTXA
    private Date lastTransactionDate; // KTLSTR
    private BigDecimal ytdTransaction; // KTYTDT
    private BigDecimal lastYearTransactionAmt; // KTLYTA

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
     * card link
     */

    @Column(name = "CARD_LINK", nullable = true, length = 30)
    public String getCardLink()
    {
        return this.cardLink;
    }

    /**
     * card link
     */
    public void setCardLink(String cardLink)
    {
        this.cardLink = cardLink;
    }

    /**
     * currency
     */

    @Column(name = "CURRENCY", nullable = true, length = 3)
    public String getCurrency()
    {
        return this.currency;
    }

    /**
     * currency
     */
    public void setCurrency(String currency)
    {
        this.currency = currency;
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
     * KTAUDT
     */

    @Temporal(TemporalType.TIMESTAMP)
    @Column(name = "AUTHORISATION_DATE", length = 26)
    public Date getAuthorisationDate()
    {
        return this.authorisationDate;
    }

    /**
     * KTAUDT
     */
    public void setAuthorisationDate(Date authorisationDate)
    {
        this.authorisationDate = authorisationDate;
    }

    /**
     * KTNODT
     */

    @Column(name = "NO_APPROVED_AUTH_TODAY", length = 3)
    public Integer getNoApprovedAuthToday()
    {
        return this.noApprovedAuthToday;
    }

    /**
     * KTNODT
     */
    public void setNoApprovedAuthToday(Integer noApprovedAuthToday)
    {
        this.noApprovedAuthToday = noApprovedAuthToday;
    }

    /**
     * KTAMDT
     */

    @Column(name = "AMOUNT_AUTHORISED_TODAY", precision = 20, scale = 3)
    public BigDecimal getAmountAuthorisedToday()
    {
        return this.amountAuthorisedToday;
    }

    /**
     * KTAMDT
     */
    public void setAmountAuthorisedToday(BigDecimal amountAuthorisedToday)
    {
        this.amountAuthorisedToday = amountAuthorisedToday;
    }

    /**
     * KTSADT
     */

    @Temporal(TemporalType.TIMESTAMP)
    @Column(name = "START_DATE_CURRENT_7_DAY_CYC", length = 26)
    public Date getStartDateCurrent7DayCyc()
    {
        return this.startDateCurrent7DayCyc;
    }

    /**
     * KTSADT
     */
    public void setStartDateCurrent7DayCyc(Date startDateCurrent7DayCyc)
    {
        this.startDateCurrent7DayCyc = startDateCurrent7DayCyc;
    }

    /**
     * KTNOPD
     */

    @Column(name = "NO_APPROVED_AUTH_7_DAYS", length = 3)
    public Integer getNoApprovedAuth7Days()
    {
        return this.noApprovedAuth7Days;
    }

    /**
     * KTNOPD
     */
    public void setNoApprovedAuth7Days(Integer noApprovedAuth7Days)
    {
        this.noApprovedAuth7Days = noApprovedAuth7Days;
    }

    /**
     * KTAMPD
     */

    @Column(name = "AMOUNT_AUTHORISED_7_DAYS", precision = 20, scale = 3)
    public BigDecimal getAmountAuthorised7Days()
    {
        return this.amountAuthorised7Days;
    }

    /**
     * KTAMPD
     */
    public void setAmountAuthorised7Days(BigDecimal amountAuthorised7Days)
    {
        this.amountAuthorised7Days = amountAuthorised7Days;
    }

    /**
     * KTIADT
     */

    @Temporal(TemporalType.TIMESTAMP)
    @Column(name = "LATEST_INTERNAT_AUTH", length = 26)
    public Date getLatestInternatAuth()
    {
        return this.latestInternatAuth;
    }

    /**
     * KTIADT
     */
    public void setLatestInternatAuth(Date latestInternatAuth)
    {
        this.latestInternatAuth = latestInternatAuth;
    }

    /**
     * KTNIDT
     */

    @Column(name = "NO_APPR_INT_AUTH_TODAY", length = 3)
    public Integer getNoApprIntAuthToday()
    {
        return this.noApprIntAuthToday;
    }

    /**
     * KTNIDT
     */
    public void setNoApprIntAuthToday(Integer noApprIntAuthToday)
    {
        this.noApprIntAuthToday = noApprIntAuthToday;
    }

    /**
     * KTAIDT
     */

    @Column(name = "AMOUNT_AUTHORISED_TODAY_INT", precision = 20, scale = 3)
    public BigDecimal getAmountAuthorisedTodayInt()
    {
        return this.amountAuthorisedTodayInt;
    }

    /**
     * KTAIDT
     */
    public void setAmountAuthorisedTodayInt(BigDecimal amountAuthorisedTodayInt)
    {
        this.amountAuthorisedTodayInt = amountAuthorisedTodayInt;
    }

    /**
     * KTSIDT
     */

    @Temporal(TemporalType.TIMESTAMP)
    @Column(name = "START_DATE_INT_7_DAY_CYCLE", length = 26)
    public Date getStartDateInt7DayCycle()
    {
        return this.startDateInt7DayCycle;
    }

    /**
     * KTSIDT
     */
    public void setStartDateInt7DayCycle(Date startDateInt7DayCycle)
    {
        this.startDateInt7DayCycle = startDateInt7DayCycle;
    }

    /**
     * KTNIPD
     */

    @Column(name = "NO_APPR_INT_AUTH_7_DAYS", length = 3)
    public Integer getNoApprIntAuth7Days()
    {
        return this.noApprIntAuth7Days;
    }

    /**
     * KTNIPD
     */
    public void setNoApprIntAuth7Days(Integer noApprIntAuth7Days)
    {
        this.noApprIntAuth7Days = noApprIntAuth7Days;
    }

    /**
     * KTIAPD
     */

    @Column(name = "INT_AMOUNT_AUTH_7_DAYS", precision = 20, scale = 3)
    public BigDecimal getIntAmountAuth7Days()
    {
        return this.intAmountAuth7Days;
    }

    /**
     * KTIAPD
     */
    public void setIntAmountAuth7Days(BigDecimal intAmountAuth7Days)
    {
        this.intAmountAuth7Days = intAmountAuth7Days;
    }

    /**
     * KTPRBO
     */

    @Column(name = "AUTHORISED_AMOUNT", precision = 20, scale = 3)
    public BigDecimal getAuthorisedAmount()
    {
        return this.authorisedAmount;
    }

    /**
     * KTPRBO
     */
    public void setAuthorisedAmount(BigDecimal authorisedAmount)
    {
        this.authorisedAmount = authorisedAmount;
    }

    /**
     * KTATRA
     */

    @Column(name = "TOTAL_TRANSACTION_AMOUNT", precision = 20, scale = 3)
    public BigDecimal getTotalTransactionAmount()
    {
        return this.totalTransactionAmount;
    }

    /**
     * KTATRA
     */
    public void setTotalTransactionAmount(BigDecimal totalTransactionAmount)
    {
        this.totalTransactionAmount = totalTransactionAmount;
    }

    /**
     * KTARNT
     */

    @Column(name = "TOTAL_INTCHARGE_AMOUNT", precision = 20, scale = 3)
    public BigDecimal getTotalIntchargeAmount()
    {
        return this.totalIntchargeAmount;
    }

    /**
     * KTARNT
     */
    public void setTotalIntchargeAmount(BigDecimal totalIntchargeAmount)
    {
        this.totalIntchargeAmount = totalIntchargeAmount;
    }

    /**
     * KTLTXA
     */

    @Column(name = "LAST_TRANSACTION_AMOUNT", precision = 20, scale = 3)
    public BigDecimal getLastTransactionAmount()
    {
        return this.lastTransactionAmount;
    }

    /**
     * KTLTXA
     */
    public void setLastTransactionAmount(BigDecimal lastTransactionAmount)
    {
        this.lastTransactionAmount = lastTransactionAmount;
    }

    /**
     * KTLSTR
     */

    @Temporal(TemporalType.TIMESTAMP)
    @Column(name = "LAST_TRANSACTION_DATE", length = 26)
    public Date getLastTransactionDate()
    {
        return this.lastTransactionDate;
    }

    /**
     * KTLSTR
     */
    public void setLastTransactionDate(Date lastTransactionDate)
    {
        this.lastTransactionDate = lastTransactionDate;
    }

    /**
     * KTYTDT
     */

    @Column(name = "YTD_TRANSACTION", precision = 20, scale = 3)
    public BigDecimal getYtdTransaction()
    {
        return this.ytdTransaction;
    }

    /**
     * KTYTDT
     */
    public void setYtdTransaction(BigDecimal ytdTransaction)
    {
        this.ytdTransaction = ytdTransaction;
    }

    /**
     * KTLYTA
     */

    @Column(name = "LAST_YEAR_TRANSACTION_AMT", precision = 20, scale = 3)
    public BigDecimal getLastYearTransactionAmt()
    {
        return this.lastYearTransactionAmt;
    }

    /**
     * KTLYTA
     */
    public void setLastYearTransactionAmt(BigDecimal lastYearTransactionAmt)
    {
        this.lastYearTransactionAmt = lastYearTransactionAmt;
    }

    @PrePersist
    void preInsert()
    {
        if(this.noApprovedAuthToday == null)
        {
            this.noApprovedAuthToday = 0;
        }
        
        if(this.amountAuthorisedToday == null)
        {
            this.amountAuthorisedToday = new BigDecimal("0.000");
        }
        
        if(this.noApprovedAuth7Days == null)
        {
            this.noApprovedAuth7Days = 0;
        }
        
        if(this.amountAuthorised7Days == null)
        {
            this.amountAuthorised7Days = new BigDecimal("0.000");
        }
        
        if(this.noApprIntAuthToday == null)
        {
            this.noApprIntAuthToday = 0;
        }
        
        if(this.amountAuthorisedTodayInt == null)
        {
            this.amountAuthorisedTodayInt = new BigDecimal("0.000");
        }
        
        if(this.noApprIntAuth7Days == null)
        {
            this.noApprIntAuth7Days = 0;
        }
        
        if(this.intAmountAuth7Days == null)
        {
            this.intAmountAuth7Days = new BigDecimal("0.000");
        }
        
        if(this.authorisedAmount == null)
        {
            this.authorisedAmount = new BigDecimal("0.000");
        }
        
        if (this.totalIntchargeAmount == null)
        {
            this.totalIntchargeAmount = new BigDecimal("0.000");
        }
        
        if(this.ytdTransaction == null)
        {
            this.ytdTransaction = new BigDecimal("0.000");
        }

        if(this.lastYearTransactionAmt == null)
        {
            this.lastYearTransactionAmt = new BigDecimal("0.000");
        }
    }

}