package vn.minhtri.jobhunter.controller;

import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import jakarta.transaction.Transactional;
import vn.minhtri.jobhunter.service.EmailService;
import vn.minhtri.jobhunter.service.SubscriberService;
import vn.minhtri.jobhunter.util.annotation.ApiMessage;

@RestController
@RequestMapping("/api/v1")
public class EmailController {

    private final EmailService emailService;
    private final SubscriberService subscriberService;

    public EmailController(EmailService emailService,
            SubscriberService subscriberService) {
        this.emailService = emailService;
        this.subscriberService = subscriberService;
    }

    @GetMapping("/email")
    @ApiMessage("Send simple email")
    @Scheduled(cron = "0 33 2 * * *", zone = "Asia/Ho_Chi_Minh")
    @Transactional
    public String sendSimpleEmail() {
        // this.emailService.sendSimpleEmail();
        this.subscriberService.sendSubscribersEmailJobs();
        return "ok";
    }
}
