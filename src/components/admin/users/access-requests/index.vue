<template>
<div>
    <h1 class="title">Access requests</h1>
    <div class="columns">
        <div class="column is-12-tablet is-6-desktop is-4-fullhd">
            <div class="card">
                <div class="card-content">
                    <div class="media">
                        <div class="media-content">
                            <p class="title is-5 is-spaced is-marginless">
                                <a href="edit-customer.html">John Miller</a>
                            </p>
                            <p class="is-size-6">XYZ Industries, Montreal</p>
                        </div><!-- media-content -->

                        <div class="media-right">
                            <span class="tag is-warning">pending</span>
                        </div><!-- media-right -->
                    </div><!-- media -->

                    <div class="media">
                        <div class="media-content">
                            <p class="title is-5 is-spaced is-marginless">
                                <a href="edit-customer.html">Samantha Rogers</a>
                            </p>
                            <p class="subtitle is-6">ACME Corporation, New York City</p>
                        </div><!-- media-content -->

                        <div class="media-right">
                            <span class="tag is-success">approved</span>
                        </div><!-- media-right -->
                    </div><!-- media -->
                    <div class="media">
                        <div class="media-content">
                            <p class="title is-5 is-spaced is-marginless">
                                <a href="edit-customer.html">Paul Jacques</a>
                            </p>
                            <p class="subtitle is-6">AAA Distribution Inc., Los Angeles</p>
                        </div><!-- media-content -->

                        <div class="media-right">
                            <span class="tag is-warning">pending</span>
                        </div><!-- media-right -->
                    </div><!-- media -->
                </div><!-- card-content-->
            </div><!-- card -->
        </div><!-- column -->

        <div class="column is-6-desktop is-6-widescreen">
            <p class="heading">
                <strong>Date and time of request</strong>
            </p>
            <p class="content">
                Nov 18, 17:38
            </p>
            <p class="heading">
                <strong>Customer </strong>
            </p>

            <p class="content">
                <strong>
                    <a href="edit-customer.html">John Miller</a>
                </strong>
                <br>
                <code>johnmiller@gmail.com</code>
                <br>
                55 Long Bridge road
                <br>
                78170 Los Angeles
                <br>
                United States
            </p><!-- content -->
            <p class="heading">
                <strong>Message</strong>
            </p>

            <p class="content">
                Hey there, I'd like to have access to your catalog. 
                Thank you in advance.
            </p><!-- content -->
            <p class="heading">
                <strong>Reply (optional)</strong>
            </p>
            <div class="field">
                <textarea class="textarea"></textarea>
            </div>

            <p class="heading">
                <strong>Actions</strong>
            </p>

            <div class="buttons">
                <button class="button  is-success is-outlined">Approve</button>
                <button class="button  is-danger is-outlined">Reject</button>
                <button class="button  is-dark is-outlined">Blacklist</button>
                <button disabled class="button is-warning ">Archive</button>
            </div><!-- buttons -->



        </div><!-- column -->

    </div><!-- columns -->
</div>
</template>

<script>
export default {
    methods:{
    },
}
</script>
