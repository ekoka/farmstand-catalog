<template>
<section class="section">
    <div class="columns">
        <div class="column is-4-tablet is-3-desktop is-2-widescreen">
            <!--<left-nav active="inquiry"/>-->
        </div>
        <div class="column">
            <div class="columns is-multiline">
                <cart class="column is-8" :emptyCart.sync="emptyCart"/>
                <p v-if="emptyCart" class="subtitle is-4">{{$t('inquiry.error.no_product_lbl')}}</p>
                <comments :emptyComments.sync="emptyComments" class="column is-8"/>
                <addresses :invalidContact.sync="invalidContact" class="column is-8"/>
            </div>
            <div class="field">
                <div class="control">
                    <span v-if="invalidContact" class="has-text-danger">
                        {{$t('inquiry.error.invalid_contact_lbl')}}
                    </span>
                </div>
                <div class="control">
                    <span v-if="emptyComments && emptyCart" class="has-text-danger">
                        {{$t('inquiry.error.empty_inquiry_lbl')}}
                    </span>
                </div>
                <div class="control">
                <button class="button is-link" :disabled="disabledButton" @click="sendInquiry">{{$t('inquiry.send_inquiry_btn')}}</button>
                </div>
            </div>
        </div><!-- column -->
    </div><!-- columns -->
</section><!-- section -->
</template>

<script>
import {mapActions, mapState, mapMutations} from 'vuex'
import map from 'lodash/fp/map'

export default {
    components: {
        topNav: ()=>import  ( '../elements/top-nav'),
        leftNav: ()=>import  ( '../elements/left-nav'),
        cart: ()=>import  ( './cart'),
        addresses: ()=>import  ( './addresses'),
        comments: ()=>import  ( './comments'),
    },

    data(){
        return {
            invalidContact: false,
            emptyCart: false,
            emptyComments: false,
            formSubmitted: false,
        }
    },


    computed:{
        ...mapState({
            inquiry: state=>state.inquiry
        }),
        inquiryView(){
            return {
                products: this.inquiry.products,
                shipping_address: this.inquiry.shippingAddress,
                billing_address: this.inquiry.billingAddress,
                comments: this.inquiry.comments && this.inquiry.comments.trim(),
            }
        },
        disabledButton(){
            return this.formSubmitted
                || this.invalidContact
                || (this.emptyCart && this.emptyComments)
        },
    },

    methods:{

        sendInquiry(){
            this.formSubmitted = true
            this.postInquiry({data:this.inquiryView}).then(response=>{
                this.clearInquiry()
                this.$router.push({name:'InquirySent'})
            }).catch(error=>{
                this.formSubmitted = false
            })
        },

        ...mapMutations({
            clearInquiry: 'inquiry/clearInquiry'
        }),

        ...mapActions({
            postInquiry: 'api/postPublicInquiry'
        })
    },

}
</script>

