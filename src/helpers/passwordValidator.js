import { Text } from "react-native"

export function passwordValidator(password) {
    if (!password) return <Text style={{ color: 'red' }}>Password can't be empty.</Text>
    if (password.length < 5) return <Text style={{ color: 'red' }}>Password must be at least 5 characters long.</Text>
    return ''
}