#List of API

authRouter
-POST/signup
-POST/login
-POST/logout

profileRouter
-GET/Profile/view
-PATCH/Profile/edit
-PATCH/Profile/password

connectionrequestRouter
-POST /request/send/like/:userId
-POST /request/send/pass/:userId
-POST /request/review/accepted/:userId
-POST /request/review/rejected/:userId

-GET/user/connetions
-GET/user/request
-GET/user/feed



STATUS: pass, like, accepted, rejected
