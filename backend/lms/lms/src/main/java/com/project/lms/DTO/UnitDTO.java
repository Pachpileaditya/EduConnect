package com.project.lms.DTO;

public class UnitDTO 
{
    private int id;
    private Integer unitno;

    public UnitDTO()
    {

    }

    public UnitDTO(Integer id, Integer unitno) {
        this.id = id;
        this.unitno = unitno;
    }

    

    public Integer getUnitno() {
        return unitno;
    }

    public void setUnitno(Integer unitno) {
        this.unitno = unitno;
    }

    public int getId() {
        return id;
    }

    public void setId(int id) {
        this.id = id;
    }

    
    
}
