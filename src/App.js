import React, { useCallback, useState, useEffect } from "react";

import {
  SafeAreaView,
  View,
  FlatList,
  Text,
  StatusBar,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import api from "./services/api";

export default function App() {
  const [repositories, setRepositories] = useState([]);

  const LoadRepositories = useCallback(async () => {
    const { data } = await api.get("repositories");

    setRepositories(data);
  }, []);

  useEffect(() => {
    LoadRepositories();
  }, []);

  async function handleLikeRepository(id) {
    const { data } = await api.post(`repositories/${id}/like`);

    const { likes } = data;
    setRepositories(
      repositories.map((repository) =>
        repository.id === id ? { ...repository, likes } : repository
      )
    );
  }

  return (
    <>
      <StatusBar barStyle="light-content" backgroundColor="#7159c1" />
      <SafeAreaView style={styles.container}>
        <FlatList
          data={repositories}
          keyExtractor={(repository) => repository.id}
          renderItem={({ item }) => {
            const { id, title, techs = [], likes = 0 } = item;

            return (
              <View style={styles.repositoryContainer}>
                <Text style={styles.repository}>{title}</Text>
                {techs && (
                  <View style={styles.techsContainer}>
                    {techs.map((tech, index) => (
                      <Text key={index} style={styles.tech}>
                        {tech}
                      </Text>
                    ))}
                  </View>
                )}

                <View style={styles.likesContainer}>
                  <Text
                    style={styles.likeText}
                    // Remember to replace "1" below with repository ID: {`repository-likes-${repository.id}`}
                    testID={`repository-likes-${id}`}
                  >
                    {likes} {likes > 1 ? "curtidas" : "curtida"}
                  </Text>
                </View>

                <TouchableOpacity
                  style={styles.button}
                  onPress={() => handleLikeRepository(id)}
                  // Remember to replace "1" below with repository ID: {`like-button-${repository.id}`}
                  testID={`like-button-${id}`}
                >
                  <Text style={styles.buttonText}>Curtir</Text>
                </TouchableOpacity>
              </View>
            );
          }}
        />
      </SafeAreaView>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#7159c1",
  },
  repositoryContainer: {
    marginBottom: 15,
    marginHorizontal: 15,
    backgroundColor: "#fff",
    padding: 20,
  },
  repository: {
    fontSize: 32,
    fontWeight: "bold",
  },
  techsContainer: {
    flexDirection: "row",
    marginTop: 10,
  },
  tech: {
    fontSize: 12,
    fontWeight: "bold",
    marginRight: 10,
    backgroundColor: "#04d361",
    paddingHorizontal: 10,
    paddingVertical: 5,
    color: "#fff",
  },
  likesContainer: {
    marginTop: 15,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  likeText: {
    fontSize: 14,
    fontWeight: "bold",
    marginRight: 10,
  },
  button: {
    marginTop: 10,
  },
  buttonText: {
    fontSize: 14,
    fontWeight: "bold",
    marginRight: 10,
    color: "#fff",
    backgroundColor: "#7159c1",
    padding: 15,
  },
});
