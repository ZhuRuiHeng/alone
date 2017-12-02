<?php

namespace app\models;

use Yii;

/**
 * This is the model class for table "player".
 *
 * @property integer $id
 * @property string $avatar_url
 * @property string $nick_name
 * @property string $openid
 * @property integer $score
 * @property integer $played
 */
class Player extends \yii\db\ActiveRecord
{
    /**
     * @inheritdoc
     */
    public static function tableName()
    {
        return 'player';
    }

   

    /**
     * @inheritdoc
     */
    public function attributeLabels()
    {
        return [
            'id' => 'ID',
            'avatar_url' => 'Avatar Url',
            'nick_name' => 'Nick Name',
            'openid' => 'Openid',
            'score' => 'Score',
            'played' => 'Played',
        ];
    }
}
