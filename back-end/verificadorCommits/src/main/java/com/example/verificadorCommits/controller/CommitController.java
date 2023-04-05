package com.example.verificadorCommits.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.verificadorCommits.entity.Commit;
import com.example.verificadorCommits.service.CommitService;


@RestController
@RequestMapping("/commits")
@CrossOrigin
public class CommitController {

	@Autowired
    private CommitService commitService;
    
    // localhost:8080/commits - com o verbo get
    @GetMapping
    public List<Commit> listarTodos(){
        return commitService.listarTodos();
    }

    // localhost:8080/commits - com verbo post
    @PostMapping
    public Commit salvar(@RequestBody Commit commit){
        return commitService.salvar(commit);
    }

    //localhost:8080/commits/1 - com o verbo delete
    @DeleteMapping("/{id}")
    public void excluir(@PathVariable("id") Long id){
        commitService.excluir(id);
    }
}
