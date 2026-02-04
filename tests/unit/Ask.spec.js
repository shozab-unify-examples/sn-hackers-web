import { render, screen } from "@testing-library/vue";
import Ask from "@/views/Ask.vue";
import axios from "axios";
import { getConfig } from "@/config";

// Mock axios
jest.mock("axios");

// Mock the ListItem component with a render function
jest.mock("@/components/ListItem.vue", () => ({
  name: "ListItem",
  props: {
    title: String,
    link: String,
    score: Number,
    user: String,
    comment_link: String,
    comment_count: Number,
  },
  render(h) {
    return h(
      "div",
      {
        attrs: {
          "data-testid": "list-item",
        },
      },
      [h("h2", this.title), h("span", `by ${this.user}`)],
    );
  },
}));

describe("Ask.vue", () => {
  const { apiUrl } = getConfig();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  const mockStories = [
    {
      id: 1,
      title: "Ask HN: First Question",
      url: null,
      points: 100,
      submitted_by: "user1",
      comments: 50,
      comments_url: "https://example.com/comments/1"
    },
    {
      id: 2,
      title: "Ask HN: Second Question",
      url: null,
      points: 200,
      submitted_by: "user2",
      comments: 75,
      comments_url: "https://example.com/comments/2"
    },
    {
      id: 3,
      title: "Ask HN: Third Question",
      url: null,
      points: 300,
      submitted_by: "user3",
      comments: 25,
      comments_url: "https://example.com/comments/3"
    },
  ];

  it("renders the page title correctly", async () => {
    // Mock successful responses
    axios.get.mockResolvedValue({ data: [] });

    const { getByText } = render(Ask);
    expect(getByText("Ask HN")).toBeTruthy();
  });

  it("fetches and displays ask posts correctly", async () => {
    // Mock the API call
    axios.get.mockResolvedValue({ data: mockStories });

    const { findAllByTestId, findByText } = render(Ask);

    // Wait for all list items to be rendered
    const listItems = await findAllByTestId("list-item");
    expect(listItems).toHaveLength(3);

    // Verify some content is rendered
    expect(await findByText("Ask HN: First Question")).toBeTruthy();
    expect(await findByText("by user1")).toBeTruthy();

    // Verify that API was called correctly
    expect(axios.get).toHaveBeenCalledWith(`${apiUrl}/stories/ask`);
  });

  it("renders empty state when API fails", async () => {
    // Mock failed API call
    axios.get.mockRejectedValue(new Error("API Error"));

    const { container } = render(Ask);
    await new Promise((resolve) => setTimeout(resolve, 0));

    // Verify only the container and title are rendered
    expect(container.querySelectorAll('[data-testid="list-item"]')).toHaveLength(0);
  });
});
