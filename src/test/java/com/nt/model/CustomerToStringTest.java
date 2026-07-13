package com.nt.model;

import static org.junit.jupiter.api.Assertions.assertDoesNotThrow;

import org.junit.jupiter.api.Test;

class CustomerToStringTest {

    @Test
    void toStringShouldNotThrowWhenCompanyIsNull() {
        Customer customer = new Customer();
        assertDoesNotThrow(customer::toString);
    }
}
