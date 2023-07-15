import { Text } from "react-native"

export function emailValidator(email) {
    const re = /\S+@\S+\.\S+/
    if (!email) return <Text style={{ color: 'red' }}>Email can't be empty.</Text>
    if (!re.test(email)) return <Text style={{ color: 'red' }}>Ooops! We need a valid email address.</Text>
    return ''
}