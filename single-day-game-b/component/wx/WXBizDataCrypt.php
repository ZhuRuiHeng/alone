<?php

namespace app\component\WX;

use yii\base\Component;
use yii\httpclient\Client;
use app\component\WX\ErrorCode;


class WXBizDataCrypt extends Component
{
    private $apiUrl= 'https://api.weixin.qq.com/sns/jscode2session?appid={appid}&secret={secret}&js_code={JSCode}&grant_type=authorization_code';
    private $appid;
    private $secret;
    private $JSCode;
    private $sessionInfo =null;

    public function getSessionInfo($JSCode='')
    {
        if($JSCode){
            $this->setJSCode($JSCode);
        }else{
            if($this->sessionInfo){
                return $this->sessionInfo;
            }
        }

        $client = new Client();
        $response = $client->createRequest()
            ->setMethod('get')
            ->setUrl($this->apiUrl)
            ->send();
        if ($response->isOk) {
            if(!isset($response->data['errcode'])){
                $this->sessionInfo = $response->data;

            }
            return $this->sessionInfo;

        }
        return false;


    }
    /**
     * @param $sessionKey string 用户在小程序登录后获取的会话密钥
     */
    /*public function setSessionKey($sessionKey)
    {
        $this->sessionKey = $sessionKey;
    }*/

    /**
     * 由组件配置
     * @param $appid string 小程序的appid
     */
    public function setAppid($appid)
    {
        $this->appid = $appid;
        $this->apiUrl = str_replace('{appid}',$this->appid,$this->apiUrl);
    }

    /**
     * 由组件配置
     * @param $secret string 小程序的 app secret
     */
    public function setSecret($secret)
    {
        $this->secret = $secret;
        $this->apiUrl = str_replace('{secret}',$this->secret,$this->apiUrl);
    }

    /**
     * 由前端传递
     * @param $js_code string 登录时获取的 code
     */
    public function setJSCode($JSCode)
    {
        $this->JSCode = $JSCode;
        $this->apiUrl = str_replace('{JSCode}',$this->JSCode,$this->apiUrl);
    }


    /**
     * 检验数据的真实性，并且获取解密后的明文.
     * @param $encryptedData string 加密的用户数据
     * @param $iv string 与用户数据一同返回的初始向量
     * @param $data string 解密后的原文
     *
     * @return int 成功0，失败返回对应的错误码
     */
    public function decryptData( $encryptedData, $iv, &$data )
    {
        if (strlen($this->sessionInfo["session_key"]) != 24) {
            return ErrorCode::$IllegalAesKey;
        }
        $aesKey=base64_decode($this->sessionInfo["session_key"]);


        if (strlen($iv) != 24) {
            return ErrorCode::$IllegalIv;
        }
        $aesIV=base64_decode($iv);

        $aesCipher=base64_decode($encryptedData);

        $result=openssl_decrypt( $aesCipher, "AES-128-CBC", $aesKey, 1, $aesIV);

        $dataObj=json_decode( $result );
        if( $dataObj  == NULL )
        {
            return ErrorCode::$IllegalBuffer;
        }
        if( $dataObj->watermark->appid != $this->appid )
        {
            return ErrorCode::$IllegalBuffer;
        }
        $data = $dataObj;
        return ErrorCode::$OK;
    }
}