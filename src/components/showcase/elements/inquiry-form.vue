<template>
<div class="box is-shadowless">
    <div class="tabs is-boxed is-centered is-marginless is-paddingless">
        <ul>
            <!--<li :class="{'is-active': activeTab=='question'}">
                <a @click="activeTab='question'">{{$t('inquiry.ask_tab')}}</a>
            </li>-->
            <li :class="{'is-active': activeTab=='rfq'}">
                <!--<a @click="activeTab='rfq'">{{$t('inquiry.rfq_tab')}}</a>-->
                <label class="label">{{$t('inquiry.rfq_tab')}}</label>
            </li>
        </ul>
    </div>
    <div class="box is-shadowless">
        <template v-if="false">
        <div v-if="activeTab=='question'">
            <div class="field">
                <div class="control">
                    <label class="label">{{$t('inquiry.questions_comments_lbl')}}</label>
                </div>
                <div class="control">
                    <textarea @input="commentsEdited=true" v-model="comments" class="textarea"></textarea>
                </div>
            </div><!-- field -->
            <div class="field is-grouped is-grouped-centered">
                <div v-if="commentsEdited" class="control">
                    <button class="button is-primary is-outlined is-small">
                        {{$t('inquiry.send_comment')}}
                    </button>
                </div>
                <div class="control">
                    <button class="button is-small" @click="closeForm">
                        {{$t('inquiry.close_form_btn')}}
                    </button>
                </div>
            </div><!-- field -->
        </div><!-- questions -->
        </template>
        <div v-if="activeTab=='rfq'">
            <div class="field">
                <div class="control">
                    <label class="label">{{$t('inquiry.requested_quantity_lbl')}}</label>
                </div>
                <div class="control">
                    <input @input="rfqEdited=true" class="input" v-model="rfq.quantity"/>
                </div>
            </div><!-- field -->
            <div class="field">
                <div class="control">
                    <label class="label">{{$t('inquiry.other_questions_lbl')}}</label>
                </div>
                <div class="control">
                    <textarea @input="rfqEdited=true" v-model="rfq.comments" class="textarea"></textarea>
                </div>
            </div><!-- field -->
            <div class="field is-grouped is-grouped-centered">
                <div v-if="showRfqButton" class="control">
                    <button class="button is-small is-link is-outlined"
                        @click="addProductToRfq(productAdded(product_id))">
                        <span v-if="productAdded(product_id)" class="">
                            {{$t('inquiry.update_rfq_btn')}}
                        </span>
                        <span v-else>
                            {{$t('inquiry.add_to_rfq_btn')}}
                        </span>
                    </button>
                </div>
                <div class="control">
                    <button v-if="productAdded(product_id)" class="button is-small is-danger is-outlined" @click="removeProductFromRfq">
                        {{$t('inquiry.remove_item_btn')}}
                    </button>
                </div>
                <div class="control">
                    <button class="button is-small" @click="closeForm">
                        {{$t('inquiry.close_form_btn')}}
                    </button>
                </div>
            </div><!-- field -->
        </div><!-- rfq -->
    </div><!-- tabs-contents -->
</div>
</template>

<script>
import {mapMutations,mapGetters,mapState} from 'vuex'

export default {
    props: ['messages'],
    model: {
        event: 'hide'
    },

    data(){
        return {
            rfqEdited: false,
            commentsEdited: false,
            toggle: false,
            rfq: {
                quantity:null,
                comments:null,
            },
            comments: null,
            //activeTab: 'question',
            activeTab: 'rfq',
        }
    },

    mounted(){
        const product = this.productAdded(this.product_id)
        if (product) {
            //{quantity, comments} = product
            this.rfq = {
                quantity:product.quantity,
                comments:product.comments
            }
            this.toggle = this.rfqFormEmpty
            this.activeTab = 'rfq'
        }
    },

    props: ['product_id', 'rfqshow'],

    computed:{
        rfqFormEmpty(){
            const rv = !(this.rfq.quantity || this.rfq.comments)
            return rv
        },
        showRfqButton(){
            this.toggle // just forcing the reevaluation of this computed property
            if(this.rfqFormEmpty){
                return false
            }
            if(this.rfqEdited){
                return true
            }
            if(!this.productAdded(this.product_id)){
                return true
            }
        },
        ...mapGetters({
            productAdded: 'inquiry/productAdded',
        }),

        ...mapState({
            inqProducts: state=>state.inquiry.products
        }),
    },

    created(){
        this.i18n = {
            messages: this.messages
        }
    },

    //i18n: {
    //    messages:{
    //        en:{
    //            ask: 'Ask a question',
    //            rfq: 'Request for quotation',
    //        },
    //        fr: {
    //            ask: 'Demandez un renseignement',
    //            rfq: 'Demande de devis',
    //        },
    //    },
    //},

    methods:{
        closeForm(){
            this.$emit('hide', false)
        },

        addProductToRfq(update){
            this.rfqEdited = false
            const rfq = {product_id:this.product_id, ...this.rfq}
            this.addProduct({rfq})
            //this.$emit('hide', false)
            this.$eventBus.$emit('message-sent-'+this.product_id, {
                message:update?'Updated':'Added',
                options:{
                    color: 'is-warning',
                    timeout: .9,
                    close: false,
                },
            })
            this.toggle = true
        },

        removeProductFromRfq(){
            this.rfqEdited = false
            this.removeProduct({product_id:this.product_id})
            this.$eventBus.$emit('message-sent-'+this.product_id, {
                message:'Removed',
                options:{
                    color: 'is-danger',
                    timeout: .9,
                    close: false,
                },
            })
            this.toggle = false

            //this.$emit('hide', false)
        },

        ...mapMutations({
            addProduct: 'inquiry/addProduct',
            removeProduct: 'inquiry/removeProduct',
        }),

    },
}
</script>

<style>
</style>
