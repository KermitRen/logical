<template>
    <div>
        <div v-for="setting in settingsArray" :key="setting.label">
            <p class="settingsLabel">{{setting.label}}</p>
            <div class="radioContainer beforeEnd" v-if="setting.type == 'radio'">
                <p :class="{radioButton: true, selectedRadioButton: option.set}" 
                @click="clickRadio(setting.label, option.val)" v-for="option in setting.options" :key="option.val">
                    {{option.name}}
                </p>
            </div>
        </div>
    </div>
</template>



<script>
export default {
    name: 'Settings',
    props: ['type'],
    data() {
        return {
            refreshKey: false
        }
    },
    methods: {
        clickRadio(settingLabel, optionValue) {
            let newSettingsObject = this.settingsArray
            let setting = newSettingsObject.find(setting => setting.label == settingLabel)
            setting.options.forEach(option => {
                option.set = (option.val == optionValue) ? true : false
            })
            
            switch (this.type) {
                case 'mosaic': localStorage.mosaicSettings = JSON.stringify(newSettingsObject); break
                case 'sudoku': localStorage.sudokuSettings = JSON.stringify(newSettingsObject); break
                case 'nurikabe': localStorage.nurikabeSettings = JSON.stringify(newSettingsObject); break
                case 'nonogram': localStorage.nonogramSettings = JSON.stringify(newSettingsObject); break
            }

            this.refreshKey = !this.refreshKey

        }
    },
    computed: {
        settingsArray() {

            //Force Reactivity
            this.refreshKey

            switch (this.type) {
                case 'mosaic': return JSON.parse(localStorage.mosaicSettings)
                case 'sudoku': return JSON.parse(localStorage.sudokuSettings)
                case 'nurikabe': return JSON.parse(localStorage.nurikabeSettings)
                case 'nonogram': return JSON.parse(localStorage.nonogramSettings)
            }
        }
    }
}
</script>

<style scoped>
.settingsLabel {
    font-size: 1.5em;
    margin-bottom: 8px;
    text-transform: capitalize;
}

.radioContainer {
    display: flex;
    flex-flow: row nowrap;
    align-items: center;
}

.beforeEnd {
    margin-bottom: 20px;
}

.radioButton {
    font-size: 1.1em;
    background-color: #91987bff;
    min-width: 25px;
    border-radius: 5px;
    padding: 1px 3px;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
}

.radioButton:not(:last-child) {
    margin-right: 15px;
}

.selectedRadioButton {
    background-color: #7b8f3aff;
}

</style>