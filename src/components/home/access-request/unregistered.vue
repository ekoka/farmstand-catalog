<template>
<div class="box">
    <h4 class='subtitle is-4'><strong>{{label}}</strong> uses a catalog by <span class="is-capitalized">{{project_name}}</span></h4>

    <p class="content is-size-5">
    You must be logged on to your <span class="is-capitalized">{{project_name}}</span> account to request access to a catalog. If you don't have an account, fill in the form below and one will be created for you while your access request is sent to <em>{{label}}</em>.
    </p>

    <div class="content columns">
        <div class="column">
            <div class="field">
                <div class="control">
                    <label class="label">
                        Email (required): <input class="input">
                    </label>
                </div>
            </div>
            <div class="field">
                <div class="control">
                    <label class="label">
                        First name (optional): <input class="input">
                    </label>
                </div>
            </div>
            <div class="field">
                <div class="control">
                    <label class="label">
                        Last name (optional): <input class="input">
                    </label>
                </div>
            </div>
            <div class="field">
                <div class="control">
                    <label class="label">
                        Telephone (optional): <input class="input">
                    </label>
                </div>
            </div>
        </div>
        <div class="column">
            <div class="field">
                <div class="control">
                    <label class="label">
                        Company (optional): <input class="input">
                    </label>
                </div>
            </div>
            <div class="field">
                <div class="control">
                    <label class="label">
                        City (optional): <input class="input">
                    </label>
                </div>
            </div>
            <div class="field">
                <div class="control">
                    <label class="label">
                        Country (optional): <input class="input">
                    </label>
                </div>
            </div>
        </div>
    </div>
    <div class="field">
        <label class="label"> Would you like to include a personal message? <span class="is-size-7">(optional)</span>
            <textarea class="textarea">
            </textarea>
        </label>
    </div>
    <div class="control"><button class="button">Send</button></div>
</div>
</template>

<script>
export default{
    props: ['domain'],
    computed: {
        label(){
            return this.domain.data.label ? this.domain.data.label : this.domain.name
        },
        project_name(){
            return this.$cnf.PROJECT_NAME
        },
    }
}
</script>
