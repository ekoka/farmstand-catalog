<template>
<div class="box is-shadowless">
    <div class="tabs is-boxed is-centered is-marginless is-paddingless">
        <ul>
            <li :class="{'is-active': activeTab=='question'}">
                <a @click="activeTab='question'">Ask a question</a>
            </li>
            <li :class="{'is-active': activeTab=='rfq'}">
                <a @click="activeTab='rfq'">Request for quotation</a>
            </li>
        </ul>
    </div> 
    <div class="box is-shadowless">
        <div v-if="activeTab=='question'">
            <div class="field">
                <div class="control">
                    <label class="label">Do you have questions or comments about this item?</label>
                </div>
                <div class="control">
                    <textarea @input="commentsEdited=true" v-model="comments" class="textarea"></textarea>
                </div>
            </div><!-- field -->
            <div class="field is-grouped is-grouped-centered">
                <div v-if="commentsEdited" class="control">
                    <button class="button is-primary is-outlined is-small">Send questions / comments</button>
                </div>
                <div class="control">
                    <button class="button is-small" @click="closeForm">Cancel</button>
                </div>
            </div><!-- field -->
        </div><!-- questions -->
        <div v-if="activeTab=='rfq'">
            <div class="field">
                <div class="control">
                    <label class="label">Requested quantity</label>
                </div>
                <div class="control">
                    <input @input="rfqEdited=true" class="input" v-model="rfq.quantity"/>
                </div>
            </div><!-- field -->
            <div class="field">
                <div class="control">
                    <label class="label">Other questions or comments about this item?</label>
                </div>
                <div class="control">
                    <textarea @input="rfqEdited=true" v-model="rfq.comments" class="textarea"></textarea>
                </div>
            </div><!-- field -->
            <div class="field is-grouped is-grouped-centered">
                <div v-if="rfqEdited" class="control">
                    <button class="button is-small is-warning" 
                        @click="addProductToRfq()">
                        <span v-if="productAdded(product_id)" class="">
                            Update Request for quotation
                        </span>
                        <span v-else>
                            Add to Request for quotation
                        </span>
                    </button>
                </div>
                <div class="control">
                    <button v-if="productAdded(product_id)" class="button is-small is-danger is-outlined" @click="removeProductFromRfq">
                        Remove
                    </button>
                </div>
                <div class="control">
                    <button class="button is-small" @click="closeForm">Cancel</button>
                </div>
            </div><!-- field -->
        </div><!-- rfq -->
    </div><!-- tabs-contents -->
</div> 
</template>

<script>
import {mapMutations,mapGetters,mapState} from 'vuex'
export default {

    model: {
        event: 'hide'
    },

    data(){
        return {
            rfqEdited: false,
            commentsEdited: false,
            rfq: {
                quantity:null,
                comments:null,
            },
            comments: null,
            activeTab: 'question',
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
            this.activeTab = 'rfq'
        }
    },

    props: ['product_id', 'rfqshow'],

    computed:{
        ...mapGetters({
            productAdded: 'inquiry/productAdded',
        }),

        ...mapState({
            inqProducts: state=>state.inquiry.products
        }),
    },

    methods:{
        closeForm(){
            this.$emit('hide', false)
        },

        addProductToRfq(){
            const rfq = {product_id:this.product_id, ...this.rfq}
            this.addProduct({rfq})
            this.$emit('hide', false)
        },

        removeProductFromRfq(){
            this.removeProduct({product_id:this.product_id})
            this.$emit('hide', false)
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
