<template>
<section>
    <div class="box">
        <h3 class="subtitle">{{$t('inquiry.contact.title_lbl')}}</h3>
        <div class="field">
            <div class="control">
                <button class="button is-info is-outlined">{{$t('inquiry.contact.copy_from_profile_btn')}}</button>
            </div><!-- control -->
        </div><!-- field -->
        <div class="field">
            <div class="control">
                <label title="required">{{$t('inquiry.contact.designation_lbl')}}</label>
            </div><!-- control -->
            <div class="control">
                <input class="input" v-model="billingAddress.title" :placeholder="designation"/>
            </div>
        </div><!-- field -->
        <div class="field">
            <div class="control">
                <label class="label" title="required">
                    {{$t('inquiry.contact.name_lbl')}}
                    <span class="has-text-danger">*</span>
                </label>
            </div><!-- control -->
            <div class="control">
                <input class="input" :class="{'is-danger': invalidName}" v-model="billingAddress.name" required placeholder="e.g. Jane Smith"/>
            </div>
        </div><!-- field -->
        <div class="field">
            <div class="control">
                <label class="label" title="required">
                    {{$t('inquiry.contact.email_lbl')}}
                    <span class="has-text-danger">*</span>
                </label>
            </div><!-- control -->
            <div class="control">
                <input class="input" :class="{'is-danger': invalidEmail}" v-model="billingAddress.email" required placeholder="e.g. jane.smith@example.com"/>
            </div>
        </div><!-- field -->
        <div class="field">
            <div class="control">
                <label>
                    {{$t('inquiry.contact.company_lbl')}}
                </label>
            </div><!-- control -->
            <div class="control">
                <input class="input" v-model="billingAddress.company"/>
            </div><!-- control -->
        </div><!-- field -->

    </div><!-- box -->

    <div class="box">
        <h3 class="subtitle">{{$t('inquiry.billing.title_lbl')}}</h3>
        <div class="field">
            <div class="control">
                <button class="button is-info is-outlined">{{$t('inquiry.billing.copy_from_profile_btn')}}</button>
            </div><!-- control -->
        </div><!-- field -->
        <div class="field">
            <div class="control">
                <label>{{$t('inquiry.billing.address_1_lbl')}}</label>
            </div><!-- control -->
            <div class="control">
                <input class="input" v-model="billingAddress.address1"/>
            </div><!-- control -->
        </div><!-- field -->
        <div class="field">
            <div class="control">
                <label>{{$t('inquiry.billing.address_2_lbl')}}</label>
            </div><!-- control -->
            <div class="control">
                <input class="input" v-model="billingAddress.address2"/>
            </div><!-- control -->
        </div><!-- field -->
        <div class="field">
            <div class="control">
                <label>{{$t('inquiry.billing.city_lbl')}}</label>
            </div><!-- control -->
            <div class="control">
                <input class="input" v-model="billingAddress.city"/>
            </div><!-- control -->
        </div><!-- field -->
        <div class="field">
            <div class="control">
                <label>{{$t('inquiry.billing.state_province_lbl')}}</label>
            </div><!-- control -->
            <div class="control">
                <input class="input" v-model="billingAddress.state_province"/>
            </div><!-- control -->
        </div><!-- field -->
        <div class="field">
            <div class="control">
                <label>{{$t('inquiry.billing.country_lbl')}}</label>
            </div><!-- control -->
            <div class="control">
                <input class="input" v-model="billingAddress.country"/>
            </div><!-- control -->
        </div><!-- field -->
        <div class="field">
            <div class="control">
                <label>{{$t('inquiry.billing.zip_postal_code_lbl')}}</label>
            </div><!-- control -->
            <div class="control">
                <input class="input" v-model="billingAddress.zip_postal_code"/>
            </div><!-- control -->
        </div><!-- field -->
    </div><!-- box -->

    <div class="box">
        <h3 class="subtitle">{{$t('inquiry.shipping.title_lbl')}}</h3>
        <div class="field">
            <div class="control">
                <button class="button is-info is-outlined">{{$t('inquiry.shipping.copy_billing_btn')}}</button>
            </div><!-- control -->
        </div><!-- field -->

        <div class="field">
            <div class="control">
                <label>{{$t('inquiry.shipping.name_company_lbl')}}</label>
            </div><!-- control -->
            <div class="control">
                <input class="input" v-model="shippingAddress.company"/>
            </div><!-- control -->
        </div>

        <div class="field">
            <div class="control">
                <label>{{$t('inquiry.shipping.address_1_lbl')}}</label>
            </div><!-- control -->
            <div class="control">
                <input class="input" v-model="shippingAddress.address1"/>
            </div><!-- control -->
        </div><!-- field -->
        <div class="field">
            <div class="control">
                <label>{{$t('inquiry.shipping.address_2_lbl')}}</label>
            </div><!-- control -->
            <div class="control">
                <input class="input" v-model="shippingAddress.address2"/>
            </div><!-- control -->
        </div><!-- field -->
        <div class="field">
            <div class="control">
                <label>{{$t('inquiry.shipping.city_lbl')}}</label>
            </div><!-- control -->
            <div class="control">
                <input class="input" v-model="shippingAddress.city"/>
            </div><!-- control -->
        </div><!-- field -->
        <div class="field">
            <div class="control">
                <label>{{$t('inquiry.shipping.state_province_lbl')}}</label>
            </div><!-- control -->
            <div class="control">
                <input class="input" v-model="shippingAddress.state_province"/>
            </div><!-- control -->
        </div><!-- field -->
        <div class="field">
            <div class="control">
                <label>{{$t('inquiry.shipping.country_lbl')}}</label>
            </div><!-- control -->
            <div class="control">
                <input class="input" v-model="shippingAddress.country"/>
            </div><!-- control -->
        </div><!-- field -->
        <div class="field">
            <div class="control">
                <label>{{$t('inquiry.shipping.zip_postal_code_lbl')}}</label>
            </div><!-- control -->
            <div class="control">
                <input class="input" v-model="shippingAddress.zip_postal_code"/>
            </div><!-- control -->
        </div><!-- field -->
    </div><!-- box -->

</section>
</template>

<script>

import join from 'lodash/fp/join'
import {mapState, mapMutations} from 'vuex'
export default {

    data() {
        return {
            designation: join(', ')([
                this.$t('inquiry.contact.designation_mrs_opt') || 'Mrs',
                this.$t('inquiry.contact.designation_mr_opt') || 'Mr',
                '...'
            ]),
        }
    },

    computed:{
        ...mapState({
            shippingAddress: state=>state.inquiry.shippingAddress,
            billingAddress: state=>state.inquiry.billingAddress,
        }),
        invalidName(){
            return !this.billingAddress.name.trim()
        },
        invalidEmail(){
            return !this.billingAddress.email.trim()
        },
        invalidContact(){
            return this.invalidName || this.invalidEmail
        },
    },

    watch:{
        billingAddress: {
            deep: true,
            handler(nv){
                this.pingMutation({})
            },
        },
        shippingAddress: {
            deep: true,
            handler(nv){
                this.pingMutation({})
            },
        },
        invalidContact: {
            immediate: true,
            handler(v){
                this.$emit('update:invalidContact', v)
            },
        },
    },

    methods:{
        ...mapMutations({
            // only because vuex-persistedstate listens to mutations
            pingMutation: 'inquiry/pingMutation',
        }),
    },

}
</script>
