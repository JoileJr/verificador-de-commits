package com.example.verificadorCommits.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.example.verificadorCommits.entity.Commit;

public interface CommitRepository extends JpaRepository<Commit, Long> {

}
