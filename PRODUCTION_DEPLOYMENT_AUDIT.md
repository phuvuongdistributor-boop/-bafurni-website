# BA_Furniture — Kiểm tra Production Deployment

Ngày kiểm tra: 2026-07-20  
Tên miền: https://bafurni.com/  
Commit recovery kỳ vọng: `137f1df40b4d2574b0d3eb52f8d757bf9b7051bf`

## Kết luận

Tại thời điểm kiểm tra, `bafurni.com` đang phục vụ đúng bản product-first recovery. Không tái hiện được sai lệch deployment mô tả trong brief khi kiểm tra bằng request mới và đối chiếu trực tiếp trong Vercel.

Các câu của homepage V8 cũ không còn trong HTML production. Hero product-first và `product-first.css` đều hiện diện.

## Đối chiếu kỳ vọng và thực tế

| Trường | Kỳ vọng | Thực tế khi kiểm tra | Kết quả |
|---|---|---|---|
| Commit | `137f1df40b4d2574b0d3eb52f8d757bf9b7051bf` | `137f1df40b4d2574b0d3eb52f8d757bf9b7051bf` | Khớp |
| Environment | Production | Production / Current | Khớp |
| Vercel project | `bafurni-website` | `bafurni-website` | Khớp |
| Vercel project ID | project phục vụ `bafurni.com` | `prj_o1GEC1dikviI8dHNt5wXNGGPWEuq` | Đã xác nhận |
| Git repository | `phuvuongdistributor-boop/-bafurni-website` | `phuvuongdistributor-boop/-bafurni-website` | Khớp |
| Production branch | `main` | `main` | Khớp |
| Root Directory | repository root | để trống, tương đương `./` | Khớp |
| Output Directory | static repository root | không override; framework `Other`, output mặc định `.` | Khớp |
| Custom domain | `bafurni.com` | Valid Configuration / Production | Khớp |
| `www` domain | redirect về apex | HTTP 308 tới `bafurni.com` | Khớp |

## Deployment production thực tế

- Vercel deployment ID: `4YZwFupY2cQNAAhjUAdF614nVA6m`
- Immutable URL: `https://bafurni-website-i3h12n3j2-phuvuongdistributor-boops-projects.vercel.app/`
- Git branch alias: `https://bafurni-website-git-main-phuvuongdistributor-boops-projects.vercel.app/`
- Custom domain: `https://bafurni.com/`
- Trạng thái: Ready
- Thời gian deploy hiển thị trên Vercel: 10 giây

## Phân biệt tên project và repository

- Vercel project: `bafurni-website`
- GitHub repository: `-bafurni-website`

Dấu gạch ngang đầu chỉ thuộc tên GitHub repository. Vercel đang kết nối đúng repository; không có bằng chứng domain trỏ nhầm project cũ.

## Bằng chứng HTTP và cache

Request production mới trả:

- HTTP 200
- Server: Vercel
- `X-Vercel-Cache: HIT`
- ETag: `"a62161a1cf024c98bdba61b668d46eb8"`
- có hero product-first và stylesheet mới
- không có hero V8 cũ

Object cache được quan sát đã là HTML recovery đúng.

## Nguyên nhân sai lệch được báo trước đó

Không còn sai lệch deployment tại thời điểm audit. Khả năng cao là tab trình duyệt/cache phía client cũ, hoặc thời điểm quan sát trước khi production alias chuyển xong sang commit recovery.

Đây là kết luận suy luận từ bằng chứng: project, domain alias, Git connection, branch, commit, root/output và HTML production hiện tại đều đồng nhất.

## Quyết định

Audit deployment đạt. Phần chỉnh giao diện được thực hiện trên nhánh preview riêng. Không cập nhật production cho tới khi preview, audit ảnh danh mục, responsive QA và báo cáo so sánh đều đạt.
