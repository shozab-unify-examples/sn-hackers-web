import { render, screen } from "@testing-library/vue";
import Hot from "@/views/Hot.vue";
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

describe("Hot.vue", () => {
  const { apiUrl } = getConfig();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  const mockStories = [
    {
      id: 1,
      title: "First Story",
      url: "https://example.com/1",
      points: 100,
      submitted_by: "user1",
      comments: 50,
      comments_url: "https://example.com/comments/1"
    },
    {
      id: 2,
      title: "Second Story",
      url: "https://example.com/2",
      points: 200,
      submitted_by: "user2",
      comments: 75,
      comments_url: "https://example.com/comments/2"
    },
    {
      id: 3,
      title: "Third Story",
      url: "https://example.com/3",
      points: 300,
      submitted_by: "user3",
      comments: 25,
      comments_url: "https://example.com/comments/3"
    },
  ];

  it("renders the page title correctly", async () => {
    // Mock successful responses
    axios.get.mockResolvedValue({ data: [] });

    const { getByText } = render(Hot);
    expect(getByText("Hot posts")).toBeTruthy();
  });

  it("fetches and displays posts correctly", async () => {
    // Mock the API call
    axios.get.mockResolvedValue({ data: mockStories });

    const { findAllByTestId, findByText } = render(Hot);

    // Wait for all list items to be rendered
    const listItems = await findAllByTestId("list-item");
    expect(listItems).toHaveLength(3);

    // Verify some content is rendered
    expect(await findByText("First Story")).toBeTruthy();
    expect(await findByText("by user1")).toBeTruthy();

    // Verify that API was called correctly
    expect(axios.get).toHaveBeenCalledWith(`${apiUrl}/stories/top`);
  });

  it("renders empty state when API fails", async () => {
    // Mock failed API call
    axios.get.mockRejectedValue(new Error("API Error"));

    const { container } = render(Hot);
    await new Promise((resolve) => setTimeout(resolve, 0));

    // Verify only the container and title are rendered
    expect(container.querySelectorAll('[data-testid="list-item"]')).toHaveLength(0);
  });

  it("handles posts without URLs gracefully", async () => {
    const storyWithoutUrl = {
      id: 1,
      title: "Story without URL",
      points: 100,
      submitted_by: "user1",
      comments: 50,
      comments_url: "https://example.com/comments/1"
    };

    axios.get.mockResolvedValue({ data: [storyWithoutUrl] });

    const { findByText } = render(Hot);

    // Verify the story is still rendered
    const storyTitle = await findByText("Story without URL");
    expect(storyTitle).toBeTruthy();
  });
});
