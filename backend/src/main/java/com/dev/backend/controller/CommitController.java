package com.dev.backend.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.dev.backend.entity.Commit;
import com.dev.backend.service.CommitService;

@RestController
@RequestMapping("/commits")
@CrossOrigin
public class CommitController {

    @Autowired
    private CommitService commitService;

    @GetMapping("/")
    public List<Commit> listarTodos() {
        return commitService.listarTodos();
    }

    @PostMapping("/")
    public Commit inserir(@RequestBody Commit commit){
        return commitService.salvar(commit);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> excluir(@PathVariable("id") Long id){
        commitService.excluir(id);
        return ResponseEntity.ok().build();
    }

}
