<script setup lang="ts">
const accountId = ref<string>("")
const chiaki = ref<string>("")

async function accountToBase64() {
    // 16位字母ID
    try {
        const bigIntAccountId = BigInt("0x" + accountId.value);

        const bytes = new Uint8Array(8);
        for (let i = 0; i < 8; i++) {
            bytes[i] = Number((bigIntAccountId >> BigInt(i * 8)) & BigInt(0xFF));
        }

        const base64AccountId = btoa(String.fromCharCode(...bytes))
        chiaki.value = base64AccountId
    } catch (e) {
        alert(e)
    }
}
</script>


<template>
    <div>
        <p>
            Offline Account（填写16位Hex ID）: <input m-inline-1 color-black b-rd-2 h-10 w-120 type="text"
                v-model="accountId" />
        </p>
        <p> {{ accountId ?? "" }} </p>
        <p>
            Encoded ID (Chiaki使用): {{ chiaki }}
        </p>
        <p>
            <button color-black bg-green w-20 p-2 b-rd-2 @click="accountToBase64">转换</button>
        </p>
    </div>
</template>