<template>
    <div class="comp-auth">
        <div class="title-page">
            <div class="flex-mid">Hello Auth</div>
        </div>
        <div class="form-frame">
            <div class="flex-mid">
                <div class="title-sec">Login to Sample with ElementUI</div>
            </div>
            <div class="flex-mid">
                <!--
                v-bindはpropsを子要素(子タグ)に渡す読み取り専用のデータ紐付けの属性？
                子要素ではprops属性で実際のデータ名との紐付けする感じ？
                ref属性は，送信・クリアボタンで呼び出す関数の引数に渡す，処理対象の枠組み要素(例えばフォーム)を示す名称を決めておくところ？
                -->
                <el-form
                    v-bind:model="formLogin"
                    v-bind:rules="ruleLogin"
                    ref="form_login"
                    label-width="120px"
                    class="form_login"
                >
                    <el-form-item label="Name" prop="name">
                        <el-input v-model="formLogin.name"></el-input>
                    </el-form-item>
                    <el-form-item label="Password" prop="password">
                        <el-input
                            v-model="formLogin.password"
                            v-bind:type="inputType"
                        >
                            <!--
                            アイコンの描画もElementUIのタグで可能．
                            https://element.eleme.io/#/en-US/component/icon
                            TODO: slot=suffixて何？

                            パスワードの表示非表示
                            - https://developpaper.com/vue-elementui-implements-password-display-hide-icon-change-js-has-three-lines-of-code-one-of-which-behaves-beautifully/
                            - https://developpaper.com/vue-elementui-realizes-the-function-of-password-display-hide-small-icon-change/
                            - https://qiita.com/m_daichi/items/1a924b6a23ee704c349e
                            - https://simedia.tech/blog/show-hide-password-input-values-with-vue-js/
                            -->
                            <i
                                slot="suffix"
                                class="el-icon-view"
                                v-on:click="showPassword"
                            ></i>
                        </el-input>
                    </el-form-item>
                    <el-form-item label="DateTime" prop="datetime">
                        <el-date-picker
                            v-model="formLogin.datetime"
                            type="datetime"
                            placeholder="開始日時の選択"
                        ></el-date-picker>
                    </el-form-item>
                    <el-form-item>
                        <!-- type=primaryはボタンの色 -->
                        <el-button
                            type="primary"
                            v-on:click="submitForm('form_login')"
                        >
                            Submit
                        </el-button>
                        <el-button v-on:click="clearForm('form_login')">
                            Clear
                        </el-button>
                    </el-form-item>
                </el-form>
            </div>
        </div>
        <div class="form-frame">
            <div class="flex-mid">
                <div class="title-sec">Login to Sample with Vuetify</div>
                <div>
                    ※ElementUIと一緒にインストールしておいて，しかし別々のパーツで実装を試す．
                </div>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    name: "Auth",
    data() {
        // dataはいわゆるstate相当
        return {
            formLogin: {
                name: "",
                password: "",
                datetime: "",
            },
            ruleLogin: {
                name: [
                    // エラーメッセージの数だけにルールを作る
                    {
                        required: true,
                        message: "Please input name.",
                        trigger: "blur", // TODO: blurって何？
                    },
                    {
                        min: 5,
                        max: 25,
                        message: "Length should be 5 to 25.",
                        trigger: "blur",
                    },
                ],
                password: [
                    {
                        required: true,
                        message: "Please input password.",
                        trigger: "blur",
                    },
                    {
                        min: 5,
                        max: 25,
                        message: "Length should be 5 to 25.",
                        trigger: "blur",
                    },
                ],
                datetime: [
                    {
                        type: "datetime",
                        required: true,
                        message: "Please pick a date time.",
                        trigger: "change", // TODO: changeって何？
                    },
                ],
            },
            inputType: "password",
        };
    },
    computed: {
        "formLogin.datetime": {
            // TODO: 動かん
            get() {
                console.log(this.formLogin.datetime);
                return this.formLogin.datetime;
            },
            set(v) {
                this.formLogin.datetime = v;
            },
        },
    },
    methods: {
        /*
        クリックとかのイベントごとや，computedとかで呼び出す用の関数を実装する場所？
        */
        submitForm(formName) {
            // validate()でv-bind:rulesに基づく判定してくれてるのか？
            this.$refs[formName].validate((valid) => {
                if (valid) {
                    alert("Submitted!");
                } else {
                    console.log("Invalid input!");
                    return false;
                }
            });
        },
        clearForm(formName) {
            this.$refs[formName].resetFields();
        },
        showPassword() {
            let el = document.getElementsByClassName("el-icon-view")[0];
            if (this.inputType === "password") {
                this.inputType = "text";
                el.style.color = "#409EFF";
            } else {
                this.inputType = "password";
                el.style.color = "#C0C4CC";
            }
        },
    },
};
</script>
