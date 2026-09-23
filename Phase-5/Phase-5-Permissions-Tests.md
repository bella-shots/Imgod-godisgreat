| ID | Test | Expected result | Status |
|---|---|---|---|
| SEC-01 | Employee opens Master Site. | Employee sees only authorized Site content. | NOT STARTED |
| SEC-02 | Employee attempts to access restricted Finance source Sheet. | Access is denied. | NOT STARTED |
| SEC-03 | Employee attempts to access Salary_Admin. | Access is denied. | NOT STARTED |
| SEC-04 | Employee attempts to access Investments. | Access is denied. | NOT STARTED |
| SEC-05 | Employee attempts to access restricted HR source data. | Access is denied unless explicitly authorized. | NOT STARTED |
| SEC-06 | Employee attempts to edit Site. | Employee cannot edit Site unless deliberately granted editor rights. | NOT STARTED |
| SEC-07 | Employee accesses project files. | Employee can access only the project/file resources explicitly shared with them. | NOT STARTED |
| SEC-08 | Admin accesses sensitive records. | Authorized admin can access required sensitive records. | NOT STARTED |
| SEC-09 | Form submission identity. | Submission can be attributed to the intended employee where the selected Form/access model supports it. | NOT STARTED |
| SEC-10 | Automation permissions. | Apps Script can perform required privileged actions without broadening employee access. | NOT STARTED |
| SEC-11 | Public exposure check. | Confidential Site pages/files are not publicly accessible through published links or unrestricted Drive links. | NOT STARTED |
| SEC-12 | Former/inactive employee check. | Inactive employee access is removed/restricted according to the maintained access process. | NOT STARTED |