package com.programming.technie.entity.blahblah;

import jakarta.persistence.*;

@Entity
@Table(name = "tbl_mophat")
public class MoPhat implements java.io.Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String username;

}
