# Formalot

## Frontend

After cloning the project, run

```
cd frontend
yarn install
yarn start
```

## Backend
Please create a virtual environment first.
*For MacOS*
```
python3 -m venv formalot-env
```
Install the packages written in requirements.txt.
```
pip -r install requirements.txt
```
If you installed new packages and need other people to use the same version of packages, write the info into txt.
```
pip freeze > requirements.txt
```

If you don't create virtual environment:
Please install Flask first.

```
pip install Flask
```
After cloning the project, run

```
cd backend
flask run
```

<br><br>

# Lottery API

## 取得抽獎品 GetGift
url = http://127.0.0.1:5000/GetGift

| Parameter | Data Type | 
| -------- | -------- | 
| form_id    | int     | 

### Request Body
``` json = 
{
  "form_id": 0
}
```

### Response
``` json = 
{
    "data": [
        {
            "amount": 1,
            "gift_name": "LG 樂金直驅變頻上下門冰箱393公升",
            "gift_pic_url": "https://i.imgur.com/j7aXj81.jpg"
        },
        {
            "amount": 1,
            "gift_name": "星巴克",
            "gift_pic_url": "https://i.imgur.com/KhpRc5G.jpg"
        }
    ],
    "message": "Get gifts successfully!!!",
    "status": "success"
}
```

## 取得抽獎名單 GetCandidate

 url = http://127.0.0.1:5000/GetCandidate

| Parameter | Data Type | 
| -------- | -------- | 
| form_id    | int     | 

### Request Body
``` json = 
{
  "form_id": 0
}
```

### Response
``` json = 
{
    "data": {
        "candidates": [
            "b07905244",
            "r09302322",
            "b07401201",
            "r09102147",
            "r10725048"
        ]
    },
    "message": "Get candidates successfully!!!",
    "status": "success"
}
```








## 手動抽獎 AutoLottery

 url = http://127.0.0.1:5000/AutoLottery

| Parameter | Data Type | 
| -------- | -------- | 
| form_id    | int     | 

### Request Body
``` json = 
{
  "form_id": 0
}
```

### Response
``` json = 
{
    "data": {
        "lottery_results": [
                {
                    "gift": "迷客夏",
                    "number": 0,
                    "winner": "b07905244"
                },
                {
                    "gift": "迷客夏",
                    "number": 1,
                    "winner": "r10725048"
                },
                {
                    "gift": "迷客夏",
                    "number": 2,
                    "winner": "b07401201"
                }
            ]
	},
    "message": "The draw is complete and the result is stored in database!!!",
    "status": "success"
}
```
:::danger
表單 form_run_state = WaitForDraw 才能抽獎(後端已加入此判斷）
:::


## 取得已關閉表單的抽獎結果 GetLotteryResults

 url = http://127.0.0.1:5000/GetLotteryResults

| Parameter | Data Type | 
| -------- | -------- | 
| form_id    | int     | 

### Request Body
``` json = 
{
  "form_id": 0
}
```

### Response
``` json = 
{
    "data": {
	    "results": [
		    {
			    "gift_name": "星巴克",
			    "gift_pic_url": "https://i.imgur.com/KhpRc5G.jpg",
			    "number": 0,
			    "student_id": "r10725048",
			    "user_avatar_url": null
		    },
		    {
		    	"gift_name": "LG 樂金直驅變頻上下門冰箱393公升",
		    	"gift_pic_url": "https://i.imgur.com/j7aXj81.jpg",
		    	"number": 0,
		    	"student_id": "r09102147",
		    	"user_avatar_url": "https://i.imgur.com/ZptQfY3.jpg"
		    }
	    ]
    },
    "message": "Get lottery results successfully!!!",
    "status": "success"
}
```
:::danger
表單 form_run_state = Closed 才能取得資訊 (後端已加入此判斷）
:::

