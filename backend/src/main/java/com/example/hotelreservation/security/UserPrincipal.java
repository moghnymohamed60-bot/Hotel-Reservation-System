package com.example.hotelreservation.security;

import com.example.hotelreservation.entity.User;
import com.example.hotelreservation.enums.AccountStatus;
import com.example.hotelreservation.enums.Role;
import com.fasterxml.jackson.annotation.JsonIgnore;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import java.util.Collection;
import java.util.Collections;
import java.util.List;

public class UserPrincipal implements UserDetails {

    private final Long id;
    private final String firstName;
    private final String lastName;
    private final String email;

    @JsonIgnore
    private final String password;

    private final String phoneNumber;
    private final Role role;
    private final AccountStatus accountStatus;
    private final Collection<? extends GrantedAuthority> authorities;

    public UserPrincipal(Long id, String firstName, String lastName, String email, String password, String phoneNumber, Role role, AccountStatus accountStatus, Collection<? extends GrantedAuthority> authorities) {
        this.id = id;
        this.firstName = firstName;
        this.lastName = lastName;
        this.email = email;
        this.password = password;
        this.phoneNumber = phoneNumber;
        this.role = role;
        this.accountStatus = accountStatus;
        this.authorities = authorities;
    }

    public static UserPrincipal create(User user) {
        List<GrantedAuthority> authorities = Collections.singletonList(
                new SimpleGrantedAuthority("ROLE_" + user.getRole().name())
        );

        return new UserPrincipal(
                user.getId(),
                user.getFirstName(),
                user.getLastName(),
                user.getEmail(),
                user.getPassword(),
                user.getPhoneNumber(),
                user.getRole(),
                user.getAccountStatus(),
                authorities
        );
    }

    public static Builder builder() {
        return new Builder();
    }

    public static class Builder {
        private Long id;
        private String firstName;
        private String lastName;
        private String email;
        private String password;
        private String phoneNumber;
        private Role role;
        private AccountStatus accountStatus;
        private Collection<? extends GrantedAuthority> authorities;

        public Builder id(Long id) { this.id = id; return this; }
        public Builder firstName(String firstName) { this.firstName = firstName; return this; }
        public Builder lastName(String lastName) { this.lastName = lastName; return this; }
        public Builder email(String email) { this.email = email; return this; }
        public Builder password(String password) { this.password = password; return this; }
        public Builder phoneNumber(String phoneNumber) { this.phoneNumber = phoneNumber; return this; }
        public Builder role(Role role) { this.role = role; return this; }
        public Builder accountStatus(AccountStatus accountStatus) { this.accountStatus = accountStatus; return this; }
        public Builder authorities(Collection<? extends GrantedAuthority> authorities) { this.authorities = authorities; return this; }

        public UserPrincipal build() {
            return new UserPrincipal(id, firstName, lastName, email, password, phoneNumber, role, accountStatus, authorities);
        }
    }

    public Long getId() { return id; }
    public String getFirstName() { return firstName; }
    public String getLastName() { return lastName; }
    public String getFullName() { return (firstName != null ? firstName : "") + " " + (lastName != null ? lastName : ""); }
    public String getEmail() { return email; }
    public String getPhoneNumber() { return phoneNumber; }
    public Role getRole() { return role; }
    public AccountStatus getAccountStatus() { return accountStatus; }

    @Override
    public String getUsername() { return email; }

    @Override
    public String getPassword() { return password; }

    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() { return authorities; }

    @Override
    public boolean isAccountNonExpired() { return true; }

    @Override
    public boolean isAccountNonLocked() { return accountStatus != AccountStatus.SUSPENDED; }

    @Override
    public boolean isCredentialsNonExpired() { return true; }

    @Override
    public boolean isEnabled() { return accountStatus == AccountStatus.ACTIVE; }
}
