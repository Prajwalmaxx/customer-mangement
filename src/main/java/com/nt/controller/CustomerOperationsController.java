package com.nt.controller;

import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import java.util.Map;
import java.util.Set;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import com.nt.model.Company;
import com.nt.model.Customer;

@RestController
public class CustomerOperationsController {

	private final List<Customer> registeredCustomers = new ArrayList<>();

	@GetMapping("/report1")
	public ResponseEntity<Customer> showData(){
		Customer cust = new Customer(101L,"Prajwal",2323343.32f,
				                     new String[] {"red","green","blue"},
				                     List.of("10th","10+2","Graduate"),
				                     Set.of(234433544L,345677445L,25678855L),
				                     Map.of("aadhar",344566576L,"panNo",2345678688L),
				                     new Company("NOKIA","PUNE","Electronics",4000));
		HttpStatus status = HttpStatus.OK;
	return new ResponseEntity<Customer>(cust,status);
	}

	@GetMapping("/customers")
	public ResponseEntity<List<Customer>> listCustomers() {
		return ResponseEntity.ok(Collections.unmodifiableList(registeredCustomers));
	}

	@PostMapping("/register")
	public ResponseEntity<Customer> registerCustomer(@RequestBody Customer cust){
		registeredCustomers.add(0, cust);
		return ResponseEntity.status(HttpStatus.CREATED).body(cust);
	}

	@PutMapping("/customers/{cno}")
	public ResponseEntity<Customer> updateCustomer(@PathVariable Long cno, @RequestBody Customer cust) {
		for (int index = 0; index < registeredCustomers.size(); index++) {
			if (registeredCustomers.get(index).getCno().equals(cno)) {
				cust.setCno(cno);
				registeredCustomers.set(index, cust);
				return ResponseEntity.ok(cust);
			}
		}
		return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
	}

	@DeleteMapping("/customers/{cno}")
	public ResponseEntity<Void> deleteCustomer(@PathVariable Long cno) {
		boolean removed = registeredCustomers.removeIf(customer -> customer.getCno().equals(cno));
		if (!removed) {
			return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
		}
		return ResponseEntity.noContent().build();
	}
	
}
