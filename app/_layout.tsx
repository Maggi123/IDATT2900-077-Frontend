// app/_layout.tsx
import { Tabs, useRouter } from "expo-router";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { Colors } from "@/constants/Colors";
import { TouchableOpacity, StyleSheet, View } from "react-native";
import {Auth0Config} from "@/constants/Auth0Config"; // Import for navigation
import { Auth0Provider } from "react-native-auth0";

export default function TabLayout() {
    const router = useRouter();

    return (
        <Auth0Provider domain={Auth0Config.domain} clientId={Auth0Config.clientId}>
            <Tabs
                screenOptions={{
                    headerShown: true,
                    headerStyle: {
                        backgroundColor: Colors.bar,
                        height: 70,
                    },
                    headerTintColor: Colors.lightpink,
                    headerTitleAlign: "center",
                    tabBarStyle: {
                        backgroundColor: Colors.bar,
                        height: 70,
                    },
                    tabBarShowLabel: false,
                }}
            >
                <Tabs.Screen
                    name="login"
                    options={{
                        href: null,
                        headerTitle: "",
                    }}
                />

                <Tabs.Screen
                    name="register"
                    options={{
                        href: null,
                        headerTitle: "",
                    }}
                />

                <Tabs.Screen
                    name="index"
                    options={{
                        headerTitle: "",
                        tabBarButton: (props) => (
                            <View style={styles.tabBarContainer}>
                                <TouchableOpacity>
                                    <View style={styles.circle}>
                                        <MaterialCommunityIcons
                                            name="home"
                                            size={35}
                                            color={Colors.bar}
                                        />
                                    </View>
                                </TouchableOpacity>
                            </View>
                        ),
                    }}
                />

                <Tabs.Screen
                    name="addPrescriptions"
                    options={{
                        href: null,
                        headerTitle: "Add digital document",
                        headerLeft: () => (
                            <TouchableOpacity onPress={() => router.back()}>
                                <MaterialCommunityIcons
                                    name="arrow-left"
                                    size={30}
                                    color={Colors.lightpink}
                                    style={{ marginLeft: 15 }}
                                />
                            </TouchableOpacity>
                        ),
                    }}
                />

                <Tabs.Screen
                    name="viewPrescriptions"
                    options={{
                        href: null,
                        headerTitle: "Prescriptions",
                        headerLeft: () => (
                            <TouchableOpacity onPress={() => router.back()}>
                                <MaterialCommunityIcons
                                    name="arrow-left"
                                    size={30}
                                    color={Colors.lightpink}
                                    style={{ marginLeft: 15 }}
                                />
                            </TouchableOpacity>
                        ),
                    }}
                />
            </Tabs>
        </Auth0Provider>
    );
}

const styles = StyleSheet.create({
    tabBarContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
    },

    circle: {
        width: 45,
        height: 45,
        borderRadius: 25,
        backgroundColor: Colors.lightpink,
        justifyContent: "center",
        alignItems: "center",
    },
});
