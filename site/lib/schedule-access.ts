// The Sites gateway supplies authenticated identity headers; never trust a client body.
export function isScheduleEditor(user:{email:string}|null,development=process.env.NODE_ENV==="development") {
 if(!user)return false;
 const email=user.email.trim().toLowerCase();
 return email==="abrosimov_j@ukr.net" || (development && email==="seedy@sites.test");
}
