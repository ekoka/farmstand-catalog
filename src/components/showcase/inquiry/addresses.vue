<template>
<section>
    <div class="box">
        <h3 class="subtitle">Contact information</h3>
        <div class="field">
            <div class="control">
                <label title="required">Title</label>
            </div><!-- control -->
            <div class="select">
                <select v-model="billingAddress.title">
                    <option disabled>--Select One--</option>
                    <option value="Mrs">Mrs</option>
                    <option value="Mr">Mr</option>
                </select>
            </div><!-- select -->
        </div><!-- field -->
        <div class="field">
            <div class="control">
                <label class="label" title="required">First name <span class="has-text-danger">*</span></label>
            </div><!-- control -->
            <div class="control">
                <input class="input" v-model="billingAddress.first_name" required placeholder="e.g. Jane"/>
            </div>
        </div><!-- field -->
        <div class="field">
            <div class="control">
                <label class="label" title="required">Last name <span class="has-text-danger">*</span></label>
            </div><!-- control -->
            <div class="control">
                <input class="input" v-model="billingAddress.last_name" required placeholder="e.g. Smith"/>
            </div>
        </div><!-- field -->
        <div class="field">
            <div class="control">
                <label class="label" title="required">Email address <span class="has-text-danger">*</span></label>
            </div><!-- control -->
            <div class="control">
                <input class="input" v-model="billingAddress.email" required placeholder="e.g. jane.smith@example.com"/>
            </div>
        </div><!-- field -->
        <div class="field">
            <div class="control">
                <label>Company</label>
            </div><!-- control -->
            <div class="control">
                <input class="input" v-model="billingAddress.company"/>
            </div><!-- control -->
        </div><!-- field -->

    </div><!-- box -->

    <div class="box">
        <h3 class="subtitle">Billing address</h3>
        <div class="field">
            <div class="control">
                <label>Address 1</label> 
            </div><!-- control -->
            <div class="control">
                <input class="input" v-model="billingAddress.address1"/>
            </div><!-- control -->
        </div><!-- field -->
        <div class="field">
            <div class="control">
                <label>Address 2</label> 
            </div><!-- control -->
            <div class="control">
                <input class="input" v-model="billingAddress.address2"/>
            </div><!-- control -->
        </div><!-- field -->
        <div class="field">
            <div class="control">
                <label>City</label> 
            </div><!-- control -->
            <div class="control">
                <input class="input" v-model="billingAddress.city"/>
            </div><!-- control -->
        </div><!-- field -->
        <div class="field">
            <div class="control">
                <label>State/Province</label> 
            </div><!-- control -->
            <div class="control">
                <input class="input" v-model="billingAddress.state_province"/>
            </div><!-- control -->
        </div><!-- field -->
        <div class="field">
            <div class="control">
                <label>Country</label> 
            </div><!-- control -->
            <div class="control">
                <input class="input" v-model="billingAddress.country"/>
            </div><!-- control -->
        </div><!-- field -->
        <div class="field">
            <div class="control">
                <label>Zip/Postal Code</label> 
            </div><!-- control -->
            <div class="control">
                <input class="input" v-model="billingAddress.zip_postal_code"/>
            </div><!-- control -->
        </div><!-- field -->
    </div><!-- box -->

    <div class="box">
        <h3 class="subtitle">Shipping address</h3>
        <div class="field">
            <div class="control">
                <button class="button is-info is-outlined">Copy billing address above</button>
            </div><!-- control -->
        </div><!-- field -->

        <div class="field">
            <div class="control">
                <label>Name/Company</label> 
            </div><!-- control -->
            <div class="control">
                <input class="input" v-model="shippingAddress.company"/>
            </div><!-- control -->
        </div>

        <div class="field">
            <div class="control">
                <label>Address 1</label> 
            </div><!-- control -->
            <div class="control">
                <input class="input" v-model="shippingAddress.address1"/>
            </div><!-- control -->
        </div><!-- field -->
        <div class="field">
            <div class="control">
                <label>Address 2</label> 
            </div><!-- control -->
            <div class="control">
                <input class="input" v-model="shippingAddress.address2"/>
            </div><!-- control -->
        </div><!-- field -->
        <div class="field">
            <div class="control">
                <label>City</label> 
            </div><!-- control -->
            <div class="control">
                <input class="input" v-model="shippingAddress.city"/>
            </div><!-- control -->
        </div><!-- field -->
        <div class="field">
            <div class="control">
                <label>State/Province</label> 
            </div><!-- control -->
            <div class="control">
                <input class="input" v-model="shippingAddress.state_province"/>
            </div><!-- control -->
        </div><!-- field -->
        <div class="field">
            <div class="control">
                <label>Country</label> 
            </div><!-- control -->
            <div class="control">
                <input class="input" v-model="shippingAddress.country"/>
            </div><!-- control -->
        </div><!-- field -->
        <div class="field">
            <div class="control">
                <label>Zip/Postal Code</label> 
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
        })
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
        }
    },

    methods:{
        ...mapMutations({
            // only because vuex-persistedstate listens to mutations
            pingMutation: 'inquiry/pingMutation',
        }),
    },

}
</script>

