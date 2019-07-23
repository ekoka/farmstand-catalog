<template>
<section>
    <div class="box">
        <h3 class="subtitle">{{$t('rfq.contact.title_lbl')}}</h3>
        <div class="field">
            <div class="control">
                <button class="button is-info is-outlined">{{$t('rfq.contact.copy_from_profile_btn')}}</button>
            </div><!-- control -->
        </div><!-- field -->
        <div class="field">
            <div class="control">
                <label title="required">{{$t('rfq.contact.designation_lbl')}}</label>
            </div><!-- control -->
            <div class="select">
                <select v-model="billingAddress.title">
                    <option disabled>{{$t('rfq.contact.designation_select_opt')}}</option>
                    <option value="Mrs">{{$t('rfq.contact.designation_mrs_opt')}}</option>
                    <option value="Mr">{{$t('rfq.contact.designation_mr_opt')}}</option>
                </select>
            </div><!-- select -->
        </div><!-- field -->
        <div class="field">
            <div class="control">
                <label class="label" title="required">
                    {{$t('rfq.contact.first_name_lbl')}} 
                    <span class="has-text-danger">*</span>
                </label>
            </div><!-- control -->
            <div class="control">
                <input class="input" :class="{'is-danger': invalidFirstName}" v-model="billingAddress.first_name" required placeholder="e.g. Jane"/>
            </div>
        </div><!-- field -->
        <div class="field">
            <div class="control">
                <label class="label" title="required">
                    {{$t('rfq.contact.last_name_lbl')}} 
                    <span class="has-text-danger">*</span>
                </label>
            </div><!-- control -->
            <div class="control">
                <input class="input" :class="{'is-danger': invalidLastName}" v-model="billingAddress.last_name" required placeholder="e.g. Smith"/>
            </div>
        </div><!-- field -->
        <div class="field">
            <div class="control">
                <label class="label" title="required">
                    {{$t('rfq.contact.email_lbl')}}
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
                    {{$t('rfq.contact.company_lbl')}}
                </label>
            </div><!-- control -->
            <div class="control">
                <input class="input" v-model="billingAddress.company"/>
            </div><!-- control -->
        </div><!-- field -->

    </div><!-- box -->

    <div class="box">
        <h3 class="subtitle">{{$t('rfq.billing.title_lbl')}}</h3>
        <div class="field">
            <div class="control">
                <button class="button is-info is-outlined">{{$t('rfq.billing.copy_from_profile_btn')}}</button>
            </div><!-- control -->
        </div><!-- field -->
        <div class="field">
            <div class="control">
                <label>{{$t('rfq.billing.address_1_lbl')}}</label> 
            </div><!-- control -->
            <div class="control">
                <input class="input" v-model="billingAddress.address1"/>
            </div><!-- control -->
        </div><!-- field -->
        <div class="field">
            <div class="control">
                <label>{{$t('rfq.billing.address_2_lbl')}}</label> 
            </div><!-- control -->
            <div class="control">
                <input class="input" v-model="billingAddress.address2"/>
            </div><!-- control -->
        </div><!-- field -->
        <div class="field">
            <div class="control">
                <label>{{$t('rfq.billing.city_lbl')}}</label> 
            </div><!-- control -->
            <div class="control">
                <input class="input" v-model="billingAddress.city"/>
            </div><!-- control -->
        </div><!-- field -->
        <div class="field">
            <div class="control">
                <label>{{$t('rfq.billing.state_province_lbl')}}</label> 
            </div><!-- control -->
            <div class="control">
                <input class="input" v-model="billingAddress.state_province"/>
            </div><!-- control -->
        </div><!-- field -->
        <div class="field">
            <div class="control">
                <label>{{$t('rfq.billing.country_lbl')}}</label> 
            </div><!-- control -->
            <div class="control">
                <input class="input" v-model="billingAddress.country"/>
            </div><!-- control -->
        </div><!-- field -->
        <div class="field">
            <div class="control">
                <label>{{$t('rfq.billing.zip_postal_code_lbl')}}</label> 
            </div><!-- control -->
            <div class="control">
                <input class="input" v-model="billingAddress.zip_postal_code"/>
            </div><!-- control -->
        </div><!-- field -->
    </div><!-- box -->

    <div class="box">
        <h3 class="subtitle">{{$t('rfq.shipping.title_lbl')}}</h3>
        <div class="field">
            <div class="control">
                <button class="button is-info is-outlined">{{$t('rfq.shipping.copy_billing_btn')}}</button>
            </div><!-- control -->
        </div><!-- field -->

        <div class="field">
            <div class="control">
                <label>{{$t('rfq.shipping.name_company_lbl')}}</label> 
            </div><!-- control -->
            <div class="control">
                <input class="input" v-model="shippingAddress.company"/>
            </div><!-- control -->
        </div>

        <div class="field">
            <div class="control">
                <label>{{$t('rfq.shipping.address_1_lbl')}}</label> 
            </div><!-- control -->
            <div class="control">
                <input class="input" v-model="shippingAddress.address1"/>
            </div><!-- control -->
        </div><!-- field -->
        <div class="field">
            <div class="control">
                <label>{{$t('rfq.shipping.address_2_lbl')}}</label> 
            </div><!-- control -->
            <div class="control">
                <input class="input" v-model="shippingAddress.address2"/>
            </div><!-- control -->
        </div><!-- field -->
        <div class="field">
            <div class="control">
                <label>{{$t('rfq.shipping.city_lbl')}}</label> 
            </div><!-- control -->
            <div class="control">
                <input class="input" v-model="shippingAddress.city"/>
            </div><!-- control -->
        </div><!-- field -->
        <div class="field">
            <div class="control">
                <label>{{$t('rfq.shipping.state_province_lbl')}}</label> 
            </div><!-- control -->
            <div class="control">
                <input class="input" v-model="shippingAddress.state_province"/>
            </div><!-- control -->
        </div><!-- field -->
        <div class="field">
            <div class="control">
                <label>{{$t('rfq.shipping.country_lbl')}}</label> 
            </div><!-- control -->
            <div class="control">
                <input class="input" v-model="shippingAddress.country"/>
            </div><!-- control -->
        </div><!-- field -->
        <div class="field">
            <div class="control">
                <label>{{$t('rfq.shipping.zip_postal_code_lbl')}}</label> 
            </div><!-- control -->
            <div class="control">
                <input class="input" v-model="shippingAddress.zip_postal_code"/>
            </div><!-- control -->
        </div><!-- field -->
    </div><!-- box -->

</section>
</template>

<script>
import {mapState, mapMutations} from 'vuex'
export default {

    computed:{
        ...mapState({
            shippingAddress: state=>state.inquiry.shippingAddress,
            billingAddress: state=>state.inquiry.billingAddress,
        }),
        invalidFirstName(){
            return !this.billingAddress.first_name.trim()
        },
        invalidLastName(){
            return !this.billingAddress.last_name.trim()
        },
        invalidEmail(){
            return !this.billingAddress.email.trim()
        },
        invalidContact(){
            return this.invalidFirstName || this.invalidLastName || this.invalidEmail
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

