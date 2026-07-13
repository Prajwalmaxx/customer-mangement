package com.nt.model;

import java.util.Arrays;
import java.util.List;
import java.util.Map;
import java.util.Set;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor

public class Customer {

private Long cno;
private String cname;
private Float billAmt;
private String[] favColor;
private List<String> studies;
private Set<Long> phoneNumbers;
private Map<String, Object> idDetails;
private Company company;

public Long getCno() {
	return cno;
}

public void setCno(Long cno) {
	this.cno = cno;
}

public String getCname() {
	return cname;
}

public void setCname(String cname) {
	this.cname = cname;
}

public Float getBillAmt() {
	return billAmt;
}

public void setBillAmt(Float billAmt) {
	this.billAmt = billAmt;
}

public String[] getFavColor() {
	return favColor;
}

public void setFavColor(String[] favColor) {
	this.favColor = favColor;
}

public List<String> getStudies() {
	return studies;
}

public void setStudies(List<String> studies) {
	this.studies = studies;
}

public Set<Long> getPhoneNumbers() {
	return phoneNumbers;
}

public void setPhoneNumbers(Set<Long> phoneNumbers) {
	this.phoneNumbers = phoneNumbers;
}

public Map<String, Object> getIdDetails() {
	return idDetails;
}

public void setIdDetails(Map<String, Object> idDetails) {
	this.idDetails = idDetails;
}

public Company getCompany() {
	return company;
}

public void setCompany(Company company) {
	this.company = company;
}

@Override
public String toString() {
	return "Customer [cno=" + cno + ", cname=" + cname + ", billAmt=" + billAmt + ", favColor="
			+ Arrays.toString(favColor) + ", studies=" + studies + ", phoneNumbers=" + phoneNumbers + ", idDetails="
			+ idDetails + ", company=" + (company != null ? company.toString() : "null") + "]";
}
}
