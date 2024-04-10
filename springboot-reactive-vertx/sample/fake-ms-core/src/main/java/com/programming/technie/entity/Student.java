package com.programming.technie.entity;

import jakarta.persistence.*;

import java.io.Serializable;

@Table(name = "students")
@Entity
public class Student implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @Column(name = "id", nullable = false, length = 30)
    private String id;

    @Column(name = "name", nullable = false, length = 150)
    private String name;
}
