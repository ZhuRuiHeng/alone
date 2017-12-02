<?php

namespace app\controllers;

use app\models\Player;
use Yii;
use yii\web\Controller;
use yii\httpclient\Client;


class SiteController extends Controller
{
    public $layout = false;
    public $enableCsrfValidation=false;
    public $wx;

    public function beforeAction($action)
    {
        $this->wx = Yii::$app->wx;
        return parent::beforeAction($action);
    }

    protected function outputJson($data){
        $response = Yii::$app->response;
        $response->format = \yii\web\Response::FORMAT_JSON;
        $response->data = $data;
        $response->send();
    }

    public function actionUserInfo()
    {
        $code = Yii::$app->request->get('code','');
        $encryptedData = Yii::$app->request->get('encrypted_data','');
        $iv = Yii::$app->request->get('iv','');
        $sessionInfo = $this->wx->getSessionInfo($code);

        $deData = null;
        if($sessionInfo){
            $errCode = $this->wx->decryptData($encryptedData, $iv, $deData);
        }
        $player = new Player();
        $row = $player::find()->select(['id','score','played'])->where(['openid'=>$deData->openId])->one();

        if(!$row){
            $player->id = 0;
            $player->openid = $deData->openId;
            $player->avatar_url = $deData->avatarUrl;
            $player->nick_name = $deData->nickName;
            $player->score = 0;
            $player->played = 0;
            $player->save();
            $row = $player::find()->where(['openid'=>$deData->openId])->one();
        }else{
            $row->avatar_url = $deData->avatarUrl;
            $row->nick_name = $deData->nickName;
            $row->save();
        }
        $outPutData = [
            'status'=>1,
            'error_code'=>0,
            'data'=>null
        ];
        if ($errCode == 0) {
            $outPutData['data'] = $row;

        } else {
            $outPutData['status'] = 0;
            $outPutData['data'] = $row;
            $outPutData['error_code'] = $errCode;
        }
        $this->outputJson($outPutData);
    }


    public function actionUserInfoBySid()
    {
        $sessionId = Yii::$app->request->get('session_id',0);
        $player = new Player();
        $row = $player::find()->select(['id','score','played'])->where(['id'=>$sessionId])->one();

        $outPutData = [
            'status'=>1,
            'error_code'=>0,
            'data'=>$row
        ];
        if(!$row){
            $outPutData['status'] = 0;
        }
        $this->outputJson($outPutData);
    }

    public function actionResult()
    {

    }

    public function actionSaveResult()
    {
        $id = Yii::$app->request->post('id',0);
        $score = Yii::$app->request->post('score',0);
        $player = new Player();
        $row = $player::find()->select(['id','score','played'])->where(['id'=>$id])->one();
        $row->score = $score;
        $row->played = 1;
        $row->save();
        $this->outputJson(['status'=>1,'data'=>$row]);
    }


}
