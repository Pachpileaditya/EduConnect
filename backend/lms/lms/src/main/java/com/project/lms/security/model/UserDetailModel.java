package com.project.lms.security.model;

import java.util.ArrayList;
import java.util.Collection;
import java.util.List;

import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import com.project.lms.entity.User;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class UserDetailModel implements UserDetails {
    private Integer id;
    private String email;
    private String password;

    private Collection<GrantedAuthority> authorities;

    public static UserDetailModel buildUserDetails(User user) 
    {
        List<GrantedAuthority> authorities = new ArrayList<>();

        authorities.add(new SimpleGrantedAuthority(user.getRole().name()));

        return new UserDetailModel
        (
                user.getId(),
                user.getEmail(),
                user.getPassword(),
                authorities);

    }

    @Override
    public String getUsername() 
    {
        return email;
    }

    @Override
    public String getPassword() 
    {
        return password;
    }

    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() 
    {
        return authorities;
    }

    public Integer getId() {
        return id;
    }

    public String getEmail() {
        return email;
    }

    @Override
    public boolean isAccountNonExpired() {

        return UserDetails.super.isAccountNonExpired();
    }

    @Override
    public boolean isAccountNonLocked() {
        return UserDetails.super.isAccountNonLocked();
    }

    @Override
    public boolean isCredentialsNonExpired() {
        return UserDetails.super.isCredentialsNonExpired();
    }

    @Override
    public boolean isEnabled() {
        return UserDetails.super.isEnabled();
    }
}
