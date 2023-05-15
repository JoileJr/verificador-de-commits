package com.dev.backend.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.dev.backend.entity.Commit;

public interface CommitRepository extends JpaRepository<Commit,Long>{
    
}
