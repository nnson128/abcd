package vn.minhtri.jobhunter.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import vn.minhtri.jobhunter.domain.response.ResCount;
import vn.minhtri.jobhunter.service.CompanyService;
import vn.minhtri.jobhunter.service.JobService;
import vn.minhtri.jobhunter.service.ResumeService;
import vn.minhtri.jobhunter.service.UserService;
import vn.minhtri.jobhunter.util.annotation.ApiMessage;
import vn.minhtri.jobhunter.util.error.IdInvalidException;
import org.springframework.web.bind.annotation.RequestParam;

@RestController
@RequestMapping("/api/v1")
public class HelloController {
    private final UserService userService;
    private final JobService jobService;
    private final CompanyService companyServicee;

    public HelloController(UserService userService, JobService jobService, CompanyService companyServicee) {
        this.userService = userService;
        this.jobService = jobService;
        this.companyServicee = companyServicee;
    }

    @GetMapping("/")
    public String getHelloWorld() throws IdInvalidException {
        return "Hello World (Hỏi Dân IT & Eric)";
    }

    @GetMapping("/count")
    @ApiMessage("Lấy doanh số")
    public ResponseEntity<ResCount> getCount() {
        ResCount resCount = new ResCount();
        resCount.setCountUser(this.userService.count());
        resCount.setCountJob(this.jobService.count());
        resCount.setCountCompany(this.companyServicee.count());
        return ResponseEntity.ok().body(resCount);
    }

}
