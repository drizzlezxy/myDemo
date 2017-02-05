#SeasonsSelection-APP

```This Application is based on WeChat Official Accounts, which uses ReactJS, Webpack, Gulp and Sass as its core tech, keeps the main trade logic from yiqiguang Hybrid App.```

```Following features about this APP:```

+ Removes all the communications between JS and Native
+ Adds a new page generator to optimize the time while creating a whole new page, which contains of template, entry and style files
+ Weixin pay is the only supported pay chanel, will supports more chanels in the coming future 

#Basic Rules

+ Codes should be developed in your own branch, such as 'feature_PersonalInfo_John', 'feature_PayStatus_Drizzle', 'feature_HomePage_Catherine'
+ Codes should be self tested before your commits/pushes, if your codes are not ready to be pushed, use 'git stash' to save your working field
+ We don't force you to add '--rebase' while pulling codes

#How to build files?

Just run "gulp build" in this root folder

#How to run a dev server locally?

Just run "gulp" in this root folder

#How to generate a new page?

We can use "node genpage.js PageName [html|ftl]" to create a new page skeleton

#How to request remote API?

Run "node proxy.js", which leads your requests to a local http(currently supported) proxy listening at port 3001, you need to check your "config.json" file first in order to get the correct responses

#Containing Pages

+ HomePage
+ PayStatusFail
+ PayStatusSuccess
+ etc...

#Containing Components

Haven't been desinged now

#Main Utils

+ CookieUtil
+ DataUtil
+ RequestUtil
+ StringUtil
+ WeixinUtil
+ CacheManager
+ etc...
