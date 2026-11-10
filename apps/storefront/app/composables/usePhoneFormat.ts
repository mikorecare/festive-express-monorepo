import { ref } from "vue"

export function usePhoneFormat(initialValue = "") {
    const phone = ref(initialValue)

    const formatPhone = (event: Event) => {
        const input = event.target as HTMLInputElement
        let value = input.value.replace(/\D/g, "")

        if (value.length > 10) value = value.slice(0, 10)

        let formatted = ""
        if (value.length > 0) formatted = "(" + value.slice(0, 3)
        if (value.length >= 4) formatted += ") " + value.slice(3, 6)
        if (value.length >= 7) formatted += "-" + value.slice(6, 10)

        input.value = formatted
        phone.value = formatted
    }

    return { phone, formatPhone }
}