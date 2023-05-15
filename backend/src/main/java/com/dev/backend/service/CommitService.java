package com.dev.backend.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.dev.backend.entity.Commit;
import com.dev.backend.repository.CommitRepository;

@Service
public class CommitService {

    @Autowired
    private CommitRepository commitRepository;

    public List<Commit> listarTodos(){
        return commitRepository.findAll();
    }

    public Commit salvar(Commit commit){
        return commitRepository.saveAndFlush(commit);
    }

    public void excluir(Long id){
        Commit commit = commitRepository.findById(id).get();
        commitRepository.delete(commit);
    }
}
