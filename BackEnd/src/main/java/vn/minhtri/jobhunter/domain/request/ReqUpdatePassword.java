package vn.minhtri.jobhunter.domain.request;

import jakarta.validation.constraints.NotBlank;

public class ReqUpdatePassword {
    @NotBlank(message = "Phải nhập mật khẩu hiện tại")
    private String currentPassword;

    @NotBlank(message = "Phải nhập mật khẩu mới")
    private String newPassword;

    public String getCurrentPassword() {
        return currentPassword;
    }

    public void setCurrentPassword(String currentPassword) {
        this.currentPassword = currentPassword;
    }

    public String getNewPassword() {
        return newPassword;
    }

    public void setNewPassword(String newPassword) {
        this.newPassword = newPassword;
    }

}
